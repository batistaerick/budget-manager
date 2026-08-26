import { z } from 'zod';

export enum RepeatInterval {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  NONE = 'NONE',
}

export enum SavingLocation {
  CASH = 'CASH',
  CHECKING_ACCOUNT = 'CHECKING_ACCOUNT',
  SAVINGS_ACCOUNT = 'SAVINGS_ACCOUNT',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  transactionType: z.enum(TransactionType),
});

export const installmentSchema = z.object({
  id: z.string(),
  installmentNumber: z.number(),
  totalInstallments: z.number(),
  amount: z.coerce.number(),
  dueDate: z.string(),
});

export const transactionSchema = z.object({
  id: z.string(),
  category: categorySchema,
  notes: z.string().nullish(),
  totalValue: z.coerce.number(),
  installmentNumbers: z.number().nullish(),
  installments: z.array(installmentSchema).nullish(),
  repeats: z.enum(RepeatInterval),
  date: z.string(),
});

export const savingSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.coerce.number(),
  location: z.enum(SavingLocation),
});

export const roleSchema = z.object({
  id: z.string(),
  roleName: z.enum(UserRole),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(roleSchema),
});

export const pageSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    content: z.array(item),
    first: z.boolean(),
    last: z.boolean(),
    number: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
  });

export type Category = z.infer<typeof categorySchema>;
export type Installment = z.infer<typeof installmentSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Saving = z.infer<typeof savingSchema>;
export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
export type Page<T> = {
  content: T[];
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
export type TransactionSortKey = 'category' | 'notes' | 'date' | 'value';
export type TransactionSortOrder = 'asc' | 'desc';
