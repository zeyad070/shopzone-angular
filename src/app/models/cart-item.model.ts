import type { Product } from './product.model';
import type { EntityId } from './entity-id.model';

export interface CartItem {
  id: EntityId;
  userId: EntityId;
  productId: EntityId;
  quantity: number;
  product?: Product;
}
