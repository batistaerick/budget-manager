import type { Role } from '@/types';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}
