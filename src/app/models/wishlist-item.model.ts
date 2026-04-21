import { EntityId } from './entity-id.model';

export interface WishlistItem {
  id: string | number;
  userId: EntityId;
  productId: EntityId;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}
