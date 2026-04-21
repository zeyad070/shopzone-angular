import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import type { Product } from '../../models/product.model';
import type { WishlistItem } from '../../models/wishlist-item.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  standalone: false,
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: string[] = [];
  loading = true;
  isAdmin = false;
  showAddProductForm = false;
  addingProduct = false;
  addingProductIds = new Set<string>();
  deletingProductIds = new Set<string>();
  updatingStockIds = new Set<string>();

  wishlistItems: WishlistItem[] = [];
  togglingWishlistIds = new Set<string>();

  searchTerm = '';
  category = '';

  private readonly fb = inject(FormBuilder);
  readonly addProductForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    image: ['', [Validators.required, Validators.pattern('https?://.+')]],
    category: ['', [Validators.required]],
    rating: [1, [Validators.required, Validators.min(0), Validators.max(5)]],
    stock: [1, [Validators.required, Validators.min(0)]],
  });

  private readonly destroy$ = new Subject<void>();
  private readonly productsApi = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly wishlistSvc = inject(WishlistService);

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();

    this.productsApi.getProducts().subscribe({
      next: (all) => (this.categories = this.productsApi.getCategories(all)),
      error: () => (this.categories = []),
    });

    const userId = this.auth.getUserId();
    if (userId) {
      if (userId) {
        this.wishlistSvc.getWishlist(userId);

        this.wishlistSvc.wishlist$
          .pipe(takeUntil(this.destroy$))
          .subscribe((items) => (this.wishlistItems = items));
      }
    }

    this.reload();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(): void {
    this.reload();
  }
  onCategoryChange(): void {
    this.reload();
  }

  trackProduct(_index: number, product: Product): string | number {
    return product.id;
  }

  isInWishlist(productId: string | number): boolean {
    return this.wishlistSvc.isInWishlist(this.wishlistItems, productId);
  }

  isTogglingWishlist(productId: string | number): boolean {
    return this.togglingWishlistIds.has(String(productId));
  }

  onToggleWishlist(product: Product): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.toastr.info('Please login to save items to your wishlist');
      return;
    }
    const key = String(product.id);
    if (this.togglingWishlistIds.has(key)) return;
    this.togglingWishlistIds.add(key);

    if (this.isInWishlist(product.id)) {
      const item = this.wishlistSvc.findItem(this.wishlistItems, product.id);
      if (!item) {
        this.togglingWishlistIds.delete(key);
        return;
      }
      this.wishlistSvc.removeFromWishlist(item.id).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter((i) => i.id !== item.id);
          this.wishlistSvc.refreshCount(userId);
          this.togglingWishlistIds.delete(key);
          this.toastr.info('Removed from wishlist');
        },
        error: () => {
          this.togglingWishlistIds.delete(key);
          this.toastr.error('Could not update wishlist');
        },
      });
    } else {
      if (this.isInWishlist(product.id)) {
        this.togglingWishlistIds.delete(key);
        return;
      }
      this.wishlistSvc.addToWishlist(userId, product).subscribe({
        next: (newItem) => {
          this.wishlistItems = [...this.wishlistItems, newItem];
          this.wishlistSvc.refreshCount(userId);
          this.togglingWishlistIds.delete(key);
          this.toastr.success(`${product.name} added to wishlist ❤️`);
        },
        error: () => {
          this.togglingWishlistIds.delete(key);
          this.toastr.error('Could not update wishlist');
        },
      });
    }
  }

  addToCart(product: Product): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.toastr.info('Please login to add items to your cart');
      return;
    }
    const productKey = String(product.id);
    if (this.addingProductIds.has(productKey)) return;
    this.addingProductIds.add(productKey);
    this.cart.addToCart(userId, product, 1).subscribe({
      next: () => {
        this.addingProductIds.delete(productKey);
        this.toastr.success(`${product.name} added to cart`);
      },
      error: (err: unknown) => {
        this.addingProductIds.delete(productKey);
        this.toastr.error(err instanceof Error ? err.message : 'Could not update cart');
      },
    });
  }

  isAdding(productId: string | number): boolean {
    return this.addingProductIds.has(String(productId));
  }
  isDeleting(productId: string | number): boolean {
    return this.deletingProductIds.has(String(productId));
  }
  isUpdatingStock(productId: string | number): boolean {
    return this.updatingStockIds.has(String(productId));
  }

  toggleAddProductForm(): void {
    this.showAddProductForm = !this.showAddProductForm;
    if (!this.showAddProductForm) {
      this.addProductForm.reset({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: '',
        rating: 1,
        stock: 1,
      });
    }
  }

  addProduct(): void {
    if (!this.isAdmin || this.addingProduct) return;
    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }
    this.addingProduct = true;
    this.productsApi.addProduct(this.addProductForm.getRawValue()).subscribe({
      next: () => {
        this.addingProduct = false;
        this.toastr.success('Product added successfully');
        this.toggleAddProductForm();
        this.reload();
      },
      error: (err: unknown) => {
        this.addingProduct = false;
        this.toastr.error(err instanceof Error ? err.message : 'Could not add product');
      },
    });
  }

  deleteProduct(product: Product): void {
    if (!this.isAdmin) return;
    const productKey = String(product.id);
    if (this.deletingProductIds.has(productKey)) return;
    this.deletingProductIds.add(productKey);
    this.productsApi.deleteProduct(product.id).subscribe({
      next: () => {
        this.deletingProductIds.delete(productKey);
        this.toastr.success(`${product.name} deleted`);
        this.reload();
      },
      error: (err: unknown) => {
        this.deletingProductIds.delete(productKey);
        this.toastr.error(err instanceof Error ? err.message : 'Could not delete product');
      },
    });
  }

  changeStock(product: Product, delta: number): void {
    if (!this.isAdmin) return;
    const nextStock = product.stock + delta;
    if (nextStock < 0) {
      this.toastr.error('Stock cannot be negative');
      return;
    }
    const productKey = String(product.id);
    if (this.updatingStockIds.has(productKey)) return;
    this.updatingStockIds.add(productKey);
    this.productsApi.updateStock(product.id, nextStock).subscribe({
      next: () => {
        this.updatingStockIds.delete(productKey);
        this.toastr.success(`Stock updated for ${product.name}`);
        this.reload();
      },
      error: (err: unknown) => {
        this.updatingStockIds.delete(productKey);
        this.toastr.error(err instanceof Error ? err.message : 'Could not update stock');
      },
    });
  }

  private reload(): void {
    this.loading = true;
    const search = this.searchTerm.trim();
    this.productsApi
      .getProducts({
        search: search.length > 0 ? search : undefined,
        category: this.category.length > 0 ? this.category : undefined,
      })
      .subscribe({
        next: (rows) => {
          this.products = rows;
          this.loading = false;
        },
        error: () => {
          this.products = [];
          this.loading = false;
        },
      });
  }
}
