import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import type { WishlistItem } from '../../models/wishlist-item.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  // styleUrl: './wishlist.component.css',
  standalone: false,
})
export class WishlistComponent implements OnInit {
  items: WishlistItem[] = [];
  loading = true;
  movingIds = new Set<string>();
  removingIds = new Set<string>();

  private readonly wishlistSvc = inject(WishlistService);
  private readonly cartSvc = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly productsApi = inject(ProductService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loading = true;
    this.wishlistSvc.getWishlist(userId);

    this.wishlistSvc.wishlist$.subscribe((items: WishlistItem[]) => {
      this.items = items;
      this.loading = false;
    });
  }

  remove(item: WishlistItem): void {
    const key = String(item.id);
    if (this.removingIds.has(key)) return;
    this.removingIds.add(key);

    this.wishlistSvc.removeFromWishlist(item.id).subscribe({
      next: () => {
        this.removingIds.delete(key);
        this.items = this.items.filter((i) => i.id !== item.id);
        this.wishlistSvc.refreshCount(this.auth.getUserId());
        this.toastr.info(`${item.name} removed from wishlist`);
      },
      error: () => {
        this.removingIds.delete(key);
        this.toastr.error('Could not remove item');
      },
    });
  }

  moveToCart(item: WishlistItem): void {
    const userId = this.auth.getUserId();
    if (!userId) return;

    const key = String(item.id);
    if (this.movingIds.has(key)) return;
    this.movingIds.add(key);

    this.productsApi.getProduct(item.productId).subscribe({
      next: (product) => {
        this.cartSvc.addToCart(userId, product, 1).subscribe({
          next: () => {
            this.wishlistSvc.removeFromWishlist(item.id).subscribe({
              next: () => {
                this.movingIds.delete(key);
                this.items = this.items.filter((i) => i.id !== item.id);
                this.wishlistSvc.refreshCount(userId);
                this.toastr.success(`${item.name} moved to cart!`);
              },
              error: () => {
                this.movingIds.delete(key);
                this.toastr.warning(`Added to cart, but could not remove from wishlist`);
              },
            });
          },
          error: () => {
            this.movingIds.delete(key);
            this.toastr.error('Could not add to cart');
          },
        });
      },
      error: () => {
        this.movingIds.delete(key);
        this.toastr.error('Product not found');
      },
    });
  }

  isMoving(id: string | number): boolean {
    return this.movingIds.has(String(id));
  }

  isRemoving(id: string | number): boolean {
    return this.removingIds.has(String(id));
  }

  trackItem(_i: number, item: WishlistItem): string | number {
    return item.id;
  }
}
