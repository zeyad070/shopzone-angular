import type { OrderItem } from './order-item.model';
import type { EntityId } from './entity-id.model';

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export interface Order {
  id: EntityId;
  userId: EntityId;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt?: string;
}
