import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  type AbstractControl,
  type ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import type { Product } from '../../models/product.model';
import type { WishlistItem } from '../../models/wishlist-item.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  standalone: false,
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: Product;
  loading = true;
  addingToCart = false;

  wishlistItems: WishlistItem[] = [];
  togglingWishlist = false;

  private readonly fb = inject(FormBuilder);
  private readonly wishlistSvc = inject(WishlistService);

  readonly form = this.fb.group({
    quantity: this.fb.nonNullable.control(1, [Validators.required, Validators.min(1)]),
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsApi: ProductService,
    private readonly cart: CartService,
    private readonly auth: AuthService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getUserId();
    if (userId) {
      if (userId) {
        this.wishlistSvc.getWishlist(userId);

        this.wishlistSvc.wishlist$
          .pipe(takeUntil(this.destroy$))
          .subscribe((items) => (this.wishlistItems = items));
      }
    }

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading = true;
          const id = params.get('id') ?? '';
          return this.productsApi.getProduct(id);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (product) => {
          this.product = product;
          const qtyCtrl = this.form.controls.quantity;

          if (product.stock <= 0) {
            qtyCtrl.disable({ emitEvent: false });
            qtyCtrl.setValue(1, { emitEvent: false });
          } else {
            qtyCtrl.enable({ emitEvent: false });
            qtyCtrl.setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(product.stock),
              (ctrl: AbstractControl): ValidationErrors | null => {
                const n = Number(ctrl.value);
                return Number.isInteger(n) ? null : { integer: true };
              },
            ]);
            qtyCtrl.setValue(1, { emitEvent: false });
          }

          qtyCtrl.updateValueAndValidity({ emitEvent: false });
          this.loading = false;
        },
        error: () => {
          this.product = undefined;
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get inWishlist(): boolean {
    if (!this.product) return false;
    return this.wishlistSvc.isInWishlist(this.wishlistItems, this.product.id);
  }

  toggleWishlist(): void {
    if (!this.product) return;

    const userId = this.auth.getUserId();
    if (!userId) {
      this.toastr.info('Please login to save items to your wishlist');
      return;
    }

    if (this.togglingWishlist) return;
    this.togglingWishlist = true;

    if (this.inWishlist) {
      const item = this.wishlistSvc.findItem(this.wishlistItems, this.product.id);
      if (!item) {
        this.togglingWishlist = false;
        return;
      }
      this.wishlistSvc.removeFromWishlist(item.id).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter((i) => i.id !== item.id);
          this.wishlistSvc.refreshCount(userId);
          this.togglingWishlist = false;
          this.toastr.info('Removed from wishlist');
        },
        error: () => {
          this.togglingWishlist = false;
          this.toastr.error('Could not update wishlist');
        },
      });
    } else {
      this.wishlistSvc.addToWishlist(userId, this.product).subscribe({
        next: (newItem) => {
          this.wishlistItems = [...this.wishlistItems, newItem];
          this.wishlistSvc.refreshCount(userId);
          this.togglingWishlist = false;
          this.toastr.success('Added to wishlist ❤️');
        },
        error: () => {
          this.togglingWishlist = false;
          this.toastr.error('Could not update wishlist');
        },
      });
    }
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  maxQty(): number {
    return this.product?.stock ?? 1;
  }

  exceedsMaxQty(): boolean {
    if (!this.product) return false;
    const n = Number(this.form.controls.quantity.value);
    return Number.isInteger(n) && n > this.product.stock;
  }

  addToCart(): void {
    if (!this.product) return;

    const userId = this.auth.getUserId();
    if (!userId) {
      this.toastr.info('Please login to add items to your cart');
      return;
    }

    if (this.form.invalid || this.product.stock <= 0) {
      this.form.markAllAsTouched();
      return;
    }

    const quantity = Number(this.form.controls.quantity.value);
    if (!Number.isInteger(quantity) || quantity < 1) {
      this.toastr.error('Invalid quantity');
      return;
    }
    if (quantity > this.product.stock) {
      this.toastr.error(`Only ${this.product.stock} items left`);
      return;
    }

    this.addingToCart = true;
    this.cart.addToCart(userId, this.product, quantity).subscribe({
      next: () => {
        this.addingToCart = false;
        this.toastr.success('Added to cart');
        this.refreshProduct();
      },
      error: () => {
        this.addingToCart = false;
        this.toastr.error('Could not update cart');
      },
    });
  }

  updateStock(change: number): void {
    if (!this.product) return;
    const newStock = this.product.stock + change;
    if (newStock < 0) return;

    this.productsApi.updateStock(this.product.id, newStock).subscribe({
      next: (updated) => {
        this.product = updated;
        const qtyCtrl = this.form.controls.quantity;
        qtyCtrl.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(updated.stock),
        ]);
        qtyCtrl.updateValueAndValidity();
        this.toastr.success('Stock updated');
      },
      error: () => this.toastr.error('Failed to update stock'),
    });
  }

  private refreshProduct(): void {
    if (!this.product?.id) return;
    this.productsApi.getProduct(this.product.id).subscribe((p) => {
      this.product = p;
      const qtyCtrl = this.form.controls.quantity;
      qtyCtrl.setValidators([Validators.required, Validators.min(1), Validators.max(p.stock)]);
      qtyCtrl.updateValueAndValidity();
    });
  }
}
