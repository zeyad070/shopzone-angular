import { Component, OnInit } from '@angular/core';
import type { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  standalone: false,
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  isAdmin = false;

  constructor(
    private readonly auth: AuthService,
    private readonly ordersApi: OrderService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin();
    const userId = this.auth.getUserId();
    if (!this.isAdmin && !userId) {
      this.orders = [];
      this.loading = false;
      return;
    }
    const request =
      this.isAdmin || !userId ? this.ordersApi.getOrders() : this.ordersApi.getOrdersForUser(userId);
    request.subscribe({
      next: (rows) => {
        this.orders = rows.sort((a, b) =>
          String(b.id).localeCompare(String(a.id), undefined, { numeric: true }),
        );
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.loading = false;
      },
    });
  }

  trackOrder(_index: number, order: Order): string | number {
    return order.id;
  }
}
