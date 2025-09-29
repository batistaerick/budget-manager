import type { TransactionType } from '@/enums/transactionType.enum';

export interface Category {
  id: string;
  name: string;
  transactionType: TransactionType;
}
