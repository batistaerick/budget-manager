import type { Role } from '@/types/role.type';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: Role[];
}
