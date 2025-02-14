'use client';
import Balance from '@/app/components/Balance';
import Transactions from '@/app/components/Transactions';
import useTransactions from '@/hooks/useTransactions';
import { TransactionType } from '@prisma/client';
import { useState, type JSX } from 'react';
import DatePickerDialog from '../components/DatePickerDialog';

export default function Home(): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());
  const { data: incomes, mutate: incomesMutate } = useTransactions(
    TransactionType.INCOME,
    { startDate: date }
  );
  const { data: expenses, mutate: expensesMutate } = useTransactions(
    TransactionType.EXPENSE,
    { startDate: date }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <DatePickerDialog
        date={date}
        setDate={setDate}
        dateFormat="MMM/yyyy"
        showMonthYearPicker
      />
      <Balance incomes={incomes ?? []} expenses={expenses ?? []} />
      <Transactions
        transactions={incomes}
        transactionsMutate={incomesMutate}
        title="Incomes"
      />
      <Transactions
        transactions={expenses}
        transactionsMutate={expensesMutate}
        title="Expenses"
      />
    </div>
  );
}
