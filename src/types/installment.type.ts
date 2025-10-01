import type { Transaction } from '@/types/transaction.type';

export interface Installment {
  id: string;
  transaction: Transaction;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  dueDate: Date;
}
