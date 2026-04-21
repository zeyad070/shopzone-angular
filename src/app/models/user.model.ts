import type { EntityId } from './entity-id.model';

export interface User {
  id: EntityId;
  name: string;
  email: string;
  password?: string;
  role: string;
}
