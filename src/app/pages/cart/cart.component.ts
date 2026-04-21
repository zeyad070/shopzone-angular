import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import type { CartItem } from '../../models/cart-item.model';
import type { EntityId } from '../../models/entity-id.model';
import { AuthService } from '../../services/auth.service';
import { CartService, NOT_ENOUGH_STOCK_MESSAGE } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  standalone: false,
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  loading = true;
  checkoutBusy = false;
  updatingQtyIds = new Set<string>();

  itemToRemove?: CartItem;

  private readonly destroy$ = new Subject<void>();
  private readonly qty$ = new Subject<{ item: CartItem; qty: number }>();

  constructor(
    private readonly auth: AuthService,
    private readonly cart: CartService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.qty$
      .pipe(
        debounceTime(450),
        switchMap(({ item, qty }) => {
          const userId = this.auth.getUserId();
          if (!userId) {
            return EMPTY;
          }
          const parsed =
            typeof qty === 'string' ? parseInt(qty, 10) : Math.trunc(Number(qty));
          if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1) {
            this.toastr.error('Invalid quantity');
            this.reload();
            return EMPTY;
          }
          if (!item.product) {
            return EMPTY;
          }
          const max = item.quantity + item.product.stock;
          if (parsed > max) {
            this.toastr.error(`Only ${item.product.stock} items left in stock`);
            this.reload();
            return EMPTY;
          }
          if (parsed === item.quantity) {
            return EMPTY;
          }
          this.updatingQtyIds.add(String(item.id));
          return this.cart.updateQuantity(item.id, parsed, userId, item.productId);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (updated) => {
          this.updatingQtyIds.delete(String(updated.id));
          const idx = this.items.findIndex((i) => String(i.id) === String(updated.id));
          if (idx >= 0) {
            this.items[idx] = { ...this.items[idx], quantity: updated.quantity };
          }
          this.toastr.success('Cart updated');
        },
        error: (err: unknown) => {
          this.updatingQtyIds.clear();
          const message = err instanceof Error ? err.message : 'Could not update quantity';
          this.toastr.error(message);
          this.reload();
        },
      });

    this.reload();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackItem(_index: number, item: CartItem): string | number {
    return item.id;
  }

  total(): number {
    return this.items.reduce((sum, row) => sum + this.lineTotal(row), 0);
  }

  hasStockProblems(): boolean {
    return this.items.some((row) => {
      if (!row.product) {
        return true;
      }
      const q = Number(row.quantity);
      if (!Number.isFinite(q) || !Number.isInteger(q) || q < 1) {
        return true;
      }
      return false;
    });
  }

  lineTotal(item: CartItem): number {
    const price = item.product?.price ?? 0;
    return price * item.quantity;
  }

  onQtyChange(item: CartItem, raw: number): void {
    this.qty$.next({ item, qty: raw });
  }

  confirmRemove(item: CartItem): void {
    this.itemToRemove = item;
  }

  removeConfirmed(): void {
    const item = this.itemToRemove;
    const userId = this.auth.getUserId();
    if (!item || !userId) {
      return;
    }
    this.cart.removeItem(item.id, userId).subscribe({
      next: () => {
        this.items = this.items.filter((i) => String(i.id) !== String(item.id));
        this.itemToRemove = undefined;
        this.toastr.success('Item removed');
      },
      error: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not remove item';
        this.toastr.error(message);
      },
    });
  }

  maxQty(item: CartItem): number {
    return Math.max(1, item.quantity + (item.product?.stock ?? 0));
  }

  isUpdatingQty(itemId: EntityId): boolean {
    return this.updatingQtyIds.has(String(itemId));
  }

  cancelRemove(): void {
    this.itemToRemove = undefined;
  }

  checkout(): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      return;
    }
    if (this.items.length === 0) {
      return;
    }
    if (this.hasStockProblems()) {
      this.toastr.error(NOT_ENOUGH_STOCK_MESSAGE);
      this.reload();
      return;
    }
    if (!window.confirm('Place this order and clear your cart?')) {
      return;
    }
    this.checkoutBusy = true;
    this.cart.checkout(userId, this.items).subscribe({
      next: () => {
        this.items = [];
        this.checkoutBusy = false;
        this.toastr.success('Order placed');
      },
      error: (err: unknown) => {
        this.checkoutBusy = false;
        if (err instanceof HttpErrorResponse) {
          const msg =
            typeof err.error === 'object' && err.error && 'message' in err.error
              ? String((err.error as { message?: string }).message)
              : err.message;
          this.toastr.error(msg.length > 0 ? msg : 'Order could not be placed');
          this.reload();
          return;
        }
        if (err instanceof Error && err.message.length > 0) {
          this.toastr.error(err.message);
        }
        this.reload();
      },
    });
  }

  private reload(): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.items = [];
      this.loading = false;
      return;
    }
    this.loading = true;
    this.cart.getCart(userId).subscribe({
      next: (rows) => {
        this.items = rows;
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.loading = false;
      },
    });
  }
}
