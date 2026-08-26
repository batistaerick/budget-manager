import {
  categorySchema,
  pageSchema,
  savingSchema,
  transactionSchema,
  userSchema,
  type Saving,
  type Transaction,
  type TransactionSortKey,
  type TransactionSortOrder,
} from './models';
import { BudgetManagerClient } from './client';
import { z } from 'zod';

export class BudgetManagerApi {
  constructor(private readonly client: BudgetManagerClient) {}

  login(email: string, password: string) {
    return this.client.request(
      '/auth/login',
      z.object({ message: z.string() }),
      { method: 'POST', body: { email, password } }
    );
  }

  logout() {
    return this.client.command('/auth/logout', { method: 'POST' });
  }

  register(email: string, password: string, name?: string) {
    return this.client.request('/users', userSchema, {
      method: 'POST',
      body: { email, password, name },
    });
  }

  currentUser() {
    return this.client.request('/users/current', userSchema);
  }

  updateUser(user: {
    readonly id: string;
    readonly email: string;
    readonly name: string;
  }) {
    return this.client.command('/users', { method: 'PUT', body: user });
  }

  categories(transactionType: 'INCOME' | 'EXPENSE') {
    return this.client.request(
      `/categories/type/${transactionType}`,
      z.array(categorySchema)
    );
  }

  transactions(query: {
    readonly transactionType: 'INCOME' | 'EXPENSE';
    readonly startDate: string;
    readonly endDate: string;
    readonly sortKey?: TransactionSortKey;
    readonly sortOrder?: TransactionSortOrder;
    readonly page?: number;
  }) {
    const params = new URLSearchParams({
      transactionType: query.transactionType,
      startDate: query.startDate,
      endDate: query.endDate,
      sortKey: query.sortKey ?? 'date',
      sortOrder: query.sortOrder ?? 'desc',
      page: String(query.page ?? 0),
    });
    return this.client.request(
      `/transactions?${params.toString()}`,
      pageSchema(transactionSchema)
    );
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'installments'>) {
    return this.client.request('/transactions', transactionSchema, {
      method: 'POST',
      body: transaction,
    });
  }

  deleteTransaction(id: string) {
    return this.client.command(`/transactions/${id}`, { method: 'DELETE' });
  }

  savings() {
    return this.client.request('/savings', z.array(savingSchema));
  }

  createSaving(saving: Omit<Saving, 'id'>) {
    return this.client.request('/savings', savingSchema, {
      method: 'POST',
      body: saving,
    });
  }

  deleteSaving(id: string) {
    return this.client.command(`/savings/${id}`, { method: 'DELETE' });
  }
}
