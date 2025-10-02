import type { RepeatInterval } from '@/enums';
import type { Category, Installment } from '@/types';

export interface Transaction {
  id: string;
  category: Category;
  notes?: string | null;
  totalValue: number;
  installmentNumbers?: number | null;
  installments?: Installment[] | null;
  repeats: RepeatInterval;
  date: string;
}
