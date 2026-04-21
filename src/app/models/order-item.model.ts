import type { EntityId } from './entity-id.model';

export interface OrderItem {
  productId: EntityId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
