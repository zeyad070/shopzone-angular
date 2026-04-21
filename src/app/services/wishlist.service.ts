import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import type { WishlistItem } from '../models/wishlist-item.model';
import type { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly API = 'http://localhost:3000/wishlist';
  private readonly http = inject(HttpClient);

  private readonly countSubject = new BehaviorSubject<number>(0);
  readonly wishlistCount$ = this.countSubject.asObservable();

  private readonly wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  readonly wishlist$ = this.wishlistSubject.asObservable();
  getWishlist(userId: string | number): void {
    this.http.get<WishlistItem[]>(`${this.API}?userId=${userId}`).subscribe({
      next: (items) => {
        this.wishlistSubject.next(items);
        this.countSubject.next(items.length);
      },
      error: () => {
        this.wishlistSubject.next([]);
        this.countSubject.next(0);
      },
    });
  }

  addToWishlist(userId: string | number, product: Product): Observable<WishlistItem> {
    const item: Omit<WishlistItem, 'id'> = {
      userId: Number(userId) || String(userId),
      productId: Number(product.id) || String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    };
    return this.http.post<WishlistItem>(this.API, item).pipe(
      tap(() => {
        this.getWishlist(userId);
      }),
    );
  }

  removeFromWishlist(itemId: string | number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${itemId}`).pipe(
      tap(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.getWishlist(userId);
        }
      }),
    );
  }

  refreshCount(userId: string | number | null): void {
    if (!userId) {
      this.countSubject.next(0);
      return;
    }
    this.getWishlist(userId);
  }

  isInWishlist(items: WishlistItem[], productId: string | number): boolean {
    return items.some((i) => String(i.productId) === String(productId));
  }

  findItem(items: WishlistItem[], productId: string | number): WishlistItem | undefined {
    return items.find((i) => String(i.productId) === String(productId));
  }
}
