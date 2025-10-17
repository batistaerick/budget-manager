'use client';

import { BalanceBarChart, DatePickerDialog } from '@/components';
import { TransactionType } from '@/enums';
import { useTransactions } from '@/hooks';
import { useState, type JSX } from 'react';

export default function AnalyticsPage(): JSX.Element {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: incomes } = useTransactions(TransactionType.INCOME, {
    startDate,
    endDate,
  });
  const { data: expenses } = useTransactions(TransactionType.EXPENSE, {
    startDate,
    endDate,
  });

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <span className="text-base font-semibold text-gray-300">
          Select Date Range
        </span>
        <div className="flex items-center rounded-full border border-gray-300 p-4 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Start Date
            </span>
            <DatePickerDialog
              date={startDate}
              setDate={setStartDate}
              dateFormat="MMMM/yyyy"
              showMonthYearPicker
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-gray-500">End Date</span>
            <DatePickerDialog
              date={endDate}
              setDate={setEndDate}
              dateFormat="MMMM/yyyy"
              showMonthYearPicker
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex cursor-default items-center justify-start rounded-xl bg-slate-700/90 p-2">
          <BalanceBarChart
            startDate={startDate}
            endDate={endDate}
            expenses={expenses ?? []}
            incomes={incomes ?? []}
            height={300}
            width={600}
          />
        </div>
      </div>
      {/*
        Here I'll create the Financial Goal component later on
      */}
    </div>
  );
}
