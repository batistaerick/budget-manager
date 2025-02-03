import FinancialMovements from '@/app/components/FinancialMovements';
import type { Transaction } from '@prisma/client';
import type { JSX } from 'react';
import type { KeyedMutator } from 'swr';

interface SingleTransactionProps {
  transactions?: Transaction[];
  transactionsMutate: KeyedMutator<Transaction[]>;
  title: string;
}

export default function Transactions({
  transactions,
  transactionsMutate,
  title,
}: Readonly<SingleTransactionProps>): JSX.Element {
  return (
    <div className="w-full rounded-xl bg-blue-950 bg-opacity-65">
      <div className="mx-3">
        <div className="w-full">
          <div className="my-2 grid grid-cols-3 text-lg">
            <div className="flex items-center">{title}</div>
            <div className="flex items-center justify-center">Date</div>
            <div className="flex items-center justify-end">Value</div>
          </div>
          <div className="no-scrollbar h-64 space-y-2 overflow-y-auto">
            {transactions?.map(
              (transaction: Transaction): JSX.Element => (
                <FinancialMovements
                  key={transaction.id}
                  transaction={transaction}
                  mutateOnDelete={transactionsMutate}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
