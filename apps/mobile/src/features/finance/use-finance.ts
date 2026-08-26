import { api } from '@/lib/api';
import {
  TransactionType,
  type Saving,
  type Transaction,
} from '@budget-manager/api-client';
import { useCallback, useEffect, useState } from 'react';

function apiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function useFinance() {
  const [incomes, setIncomes] = useState<readonly Transaction[]>([]);
  const [expenses, setExpenses] = useState<readonly Transaction[]>([]);
  const [savings, setSavings] = useState<readonly Saving[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    try {
      const [incomePage, expensePage, savingItems] = await Promise.all([
        api.transactions({
          transactionType: TransactionType.INCOME,
          startDate: apiDate(start),
          endDate: apiDate(end),
        }),
        api.transactions({
          transactionType: TransactionType.EXPENSE,
          startDate: apiDate(start),
          endDate: apiDate(end),
        }),
        api.savings(),
      ]);
      setIncomes(incomePage.content);
      setExpenses(expensePage.content);
      setSavings(savingItems);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'Unable to load your finances.'
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return { incomes, expenses, savings, loading, error, refresh };
}

export function money(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
