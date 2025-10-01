'use client';

import FinancialMovements from '@/components/FinancialMovements';
import type { Transaction } from '@/types/transaction.type';
import type { JSX } from 'react';
import type { KeyedMutator } from 'swr';

interface SingleTransactionProps {
  transactions?: Transaction[];
  transactionsMutate: KeyedMutator<Transaction[]>;
  title: string;
  selectedDate: Date;
}

export default function Transactions({
  transactions,
  transactionsMutate,
  title,
  selectedDate,
}: Readonly<SingleTransactionProps>): JSX.Element {
  return (
    <div className="h-full w-full rounded-xl bg-blue-950/90 px-3">
      <div className="my-2 grid grid-cols-4 text-lg">
        <div className="flex items-center">{title}</div>
        <div className="flex items-center justify-center">Notes</div>
        <div className="flex items-center justify-center">Date</div>
        <div className="flex items-center justify-end">Value</div>
      </div>
      <div className="no-scrollbar space-y-2 overflow-y-auto">
        {transactions?.map(
          (transaction: Transaction): JSX.Element => (
            <FinancialMovements
              key={transaction.id}
              transaction={transaction}
              mutateOnDelete={transactionsMutate}
              selectedDate={selectedDate}
            />
          )
        )}
      </div>
    </div>
  );
}
