import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { EntityId } from '../models/entity-id.model';
import type { Product } from '../models/product.model';
import { API_BASE_URL } from '../core/constants/api.constants';

export interface ProductFilters {
  search?: string;
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = `${API_BASE_URL}/products`;

  constructor(private readonly http: HttpClient) {}

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let params = new HttpParams();
    if (filters?.search && filters.search.trim().length > 0) {
      params = params.set('name_like', filters.search.trim());
    }
    if (filters?.category && filters.category.length > 0) {
      params = params.set('category', filters.category);
    }
    return this.http.get<Product[]>(this.api, { params });
  }

  getProduct(id: EntityId): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  patchProduct(
    productId: EntityId,
    patch: Partial<Pick<Product, 'stock'>>,
  ): Observable<Product> {
    return this.http.patch<Product>(`${this.api}/${productId}`, patch);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.api, product);
  }

  updateStock(productId: EntityId, stock: number): Observable<Product> {
    return this.http.patch<Product>(`${this.api}/${productId}`, { stock });
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.api, product);
  }

  updateProduct(productId: EntityId, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.api}/${productId}`, product);
  }

  deleteProduct(productId: EntityId): Observable<void> {
    return this.http.delete<void>(`${this.api}/${productId}`);
  }

  getCategories(products: Product[]): string[] {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
}
