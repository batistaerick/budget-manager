import type { SavingLocation } from '@/enums';

export interface Saving {
  id: string;
  name: string;
  amount: number;
  location: SavingLocation;
}
