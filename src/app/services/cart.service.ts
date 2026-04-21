import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import type { CartItem } from '../models/cart-item.model';
import type { EntityId } from '../models/entity-id.model';
import type { Order } from '../models/order.model';
import type { OrderItem } from '../models/order-item.model';
import type { Product } from '../models/product.model';
import { API_BASE_URL } from '../core/constants/api.constants';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

export const NOT_ENOUGH_STOCK_MESSAGE = 'Not enough stock available';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly api = `${API_BASE_URL}/cart`;
  private readonly cartCountSubject = new BehaviorSubject<number>(0);
  readonly cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly products: ProductService,
    private readonly orders: OrderService,
  ) {}

  private normalizeId(id: EntityId): string {
    return String(id).trim();
  }

  refreshCount(userId: EntityId | null): void {
    if (!userId) {
      this.cartCountSubject.next(0);
      return;
    }
    this.getRawCart(this.normalizeId(userId))
      .pipe(
        map((items) => items.reduce((sum, i) => sum + i.quantity, 0)),
        tap((count) => this.cartCountSubject.next(count)),
      )
      .subscribe();
  }

  getCart(userId: EntityId): Observable<CartItem[]> {
    return this.getRawCart(this.normalizeId(userId)).pipe(
      switchMap((items) => this.mergeProducts(items)),
      tap((items) => this.cartCountSubject.next(items.reduce((sum, i) => sum + i.quantity, 0))),
    );
  }

  addToCart(userId: EntityId, product: Product, quantity: number): Observable<CartItem> {
    const q = this.assertPositiveIntegerQuantity(quantity);
    if (q === null) {
      return throwError(() => new Error('Invalid quantity'));
    }

    return this.products.getProduct(product.id).pipe(
      switchMap((fresh) => {
        if (fresh.stock <= 0) {
          return throwError(() => new Error('Out of stock'));
        }
        if (q > fresh.stock) {
          return throwError(() => new Error(this.onlyLeftMessage(fresh.stock)));
        }
        return this.findLine(userId, fresh.id).pipe(
          switchMap((existing) => {
            if (existing) {
              const nextQty = existing.quantity + q;
              const maxQty = fresh.stock;
              if (nextQty > maxQty) {
                return throwError(() => new Error(this.onlyLeftMessage(fresh.stock)));
              }
              return this.products.patchProduct(fresh.id, { stock: fresh.stock - q }).pipe(
                switchMap(() =>
                  this.http.patch<CartItem>(`${this.api}/${existing.id}`, {
                    quantity: nextQty,
                  }),
                ),
              );
            }
            return this.products.patchProduct(fresh.id, { stock: fresh.stock - q }).pipe(
              switchMap(() => {
                const body = {
                  userId: this.normalizeId(userId),
                  productId: this.normalizeId(fresh.id),
                  quantity: q,
                };
                return this.http.post<CartItem>(this.api, body);
              }),
            );
          }),
        );
      }),
      tap(() => {
        this.refreshCount(this.normalizeId(userId));
      }),
    );
  }

  updateQuantity(
    cartItemId: EntityId,
    quantity: number,
    userId: EntityId,
    productId: EntityId,
  ): Observable<CartItem> {
    const q = this.assertPositiveIntegerQuantity(quantity);
    if (q === null) {
      return throwError(() => new Error('Invalid quantity'));
    }

    return this.products.getProduct(productId).pipe(
      switchMap((fresh) => {
        return this.http.get<CartItem>(`${this.api}/${cartItemId}`).pipe(
          switchMap((existing) => {
            if (
              String(existing.userId) !== String(userId) ||
              String(existing.productId) !== String(productId)
            ) {
              return throwError(() => new Error('Invalid cart item'));
            }
            const delta = q - existing.quantity;
            if (delta === 0) {
              return of(existing);
            }

            if (delta > 0 && delta > fresh.stock) {
              return throwError(() => new Error(this.onlyLeftMessage(fresh.stock)));
            }

            const nextStock = fresh.stock - delta;
            if (nextStock < 0) {
              return throwError(() => new Error(NOT_ENOUGH_STOCK_MESSAGE));
            }

            return this.products.patchProduct(productId, { stock: nextStock }).pipe(
              switchMap(() =>
                this.http.patch<CartItem>(`${this.api}/${cartItemId}`, { quantity: q }),
              ),
              tap(() => {
                this.refreshCount(this.normalizeId(userId));
              }),
            );
          }),
        );
      }),
    );
  }

  removeItem(cartItemId: EntityId, userId: EntityId): Observable<void> {
    return this.http.get<CartItem>(`${this.api}/${cartItemId}`).pipe(
      switchMap((line) => {
        if (String(line.userId) !== String(userId)) {
          return throwError(() => new Error('Invalid cart item'));
        }
        return this.products.getProduct(line.productId).pipe(
          switchMap((fresh) =>
            this.products.patchProduct(line.productId, { stock: fresh.stock + line.quantity }),
          ),
          switchMap(() => this.http.delete<void>(`${this.api}/${cartItemId}`)),
        );
      }),
      tap(() => {
        this.refreshCount(this.normalizeId(userId));
      }),
    );
  }

  checkout(userId: EntityId, items: CartItem[], status: 'pending' = 'pending'): Observable<void> {
    if (items.length === 0) {
      return throwError(() => new Error('Cart is empty'));
    }

    for (const i of items) {
      const lineQty = this.assertPositiveIntegerQuantity(i.quantity);
      if (lineQty === null) {
        return throwError(() => new Error('Invalid quantity'));
      }
    }

    return forkJoin(items.map((i) => this.products.getProduct(i.productId))).pipe(
      switchMap((freshProducts) => {
        const orderItems: OrderItem[] = [];
        for (let idx = 0; idx < items.length; idx++) {
          const line = items[idx];
          const p = freshProducts[idx];
          const lineQty = this.assertPositiveIntegerQuantity(line.quantity);
          if (!p || lineQty === null) {
            return throwError(() => new Error('Cart item is missing product details'));
          }
          orderItems.push({
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: lineQty,
            image: p.image,
          });
        }

        const total = orderItems.reduce((sum, row) => sum + row.price * row.quantity, 0);
        const orderBody: Omit<Order, 'id'> = {
          userId,
          status,
          total,
          items: orderItems,
          createdAt: new Date().toISOString(),
        };

        return this.orders.createOrder(orderBody).pipe(
          switchMap(() =>
            forkJoin(items.map((i) => this.http.delete<void>(`${this.api}/${i.id}`))),
          ),
          map(() => undefined),
          tap(() => this.refreshCount(this.normalizeId(userId))),
        );
      }),
    );
  }

  private assertPositiveIntegerQuantity(quantity: number): number | null {
    const n = Number(quantity);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
      return null;
    }
    return n;
  }

  private getRawCart(userId: EntityId): Observable<CartItem[]> {
    return this.http
      .get<CartItem[]>(this.api)
      .pipe(
        map((items) => items.filter((i) => String(i.userId).trim() === this.normalizeId(userId))),
      );
  }

  private findLine(userId: EntityId, productId: EntityId): Observable<CartItem | undefined> {
    const params = new HttpParams()
      .set('userId', this.normalizeId(userId))
      .set('productId', this.normalizeId(productId));

    return this.http.get<CartItem[]>(this.api, { params }).pipe(map((rows) => rows[0]));
  }

  private mergeProducts(items: CartItem[]): Observable<CartItem[]> {
    if (items.length === 0) {
      return of([]);
    }
    return this.products.getProducts().pipe(
      map((catalog) => {
        const byId = new Map(catalog.map((p) => [p.id, p]));
        return items.map((item) => ({
          ...item,
          product: byId.get(item.productId),
        }));
      }),
    );
  }

  private onlyLeftMessage(stock: number): string {
    const safe = Math.max(0, Math.trunc(stock));
    return `Only ${safe} items left in stock`;
  }
}
