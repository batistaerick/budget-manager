import type { RepeatInterval } from '@/enums/repeatInterval.enum';
import type { Category } from '@/types/category.type';
import type { Installment } from '@/types/installment.type';

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
