import type { EntityId } from './entity-id.model';

export interface Product {
  id: EntityId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}
