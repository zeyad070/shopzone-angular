import { Component, Input } from '@angular/core';
import type { EntityId } from '../../../models/entity-id.model';
import type { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css',
  standalone: false,
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;

  trackLine(_index: number, line: { productId: EntityId }): string | number {
    return line.productId;
  }

  statusClass(): string {
    switch (this.order.status) {
      case 'pending':
        return 'text-bg-warning';
      case 'processing':
        return 'text-bg-info';
      case 'delivered':
        return 'text-bg-success';
      case 'cancelled':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  }
}
