import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { EntityId } from '../models/entity-id.model';
import type { Order } from '../models/order.model';
import { API_BASE_URL } from '../core/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = `${API_BASE_URL}/orders`;

  constructor(private readonly http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.api);
  }

  getOrdersForUser(userId: EntityId): Observable<Order[]> {
    const params = new HttpParams().set('userId', String(userId));
    return this.http.get<Order[]>(this.api, { params });
  }

  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(this.api, order);
  }
}
