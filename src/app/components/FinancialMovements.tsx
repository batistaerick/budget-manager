import Money from '@/app/components/Money';
import { deleteFetcher } from '@/libs/fetchers';
import { formatDate } from '@/utils/globalFormats';
import type { Transaction } from '@prisma/client';
import type { JSX } from 'react';
import { BiEdit } from 'react-icons/bi';
import { FcFullTrash } from 'react-icons/fc';
import { KeyedMutator } from 'swr';

export interface FinancialMovementsProps {
  transaction: Transaction;
  mutateOnDelete: KeyedMutator<Transaction[]>;
}

export default function FinancialMovements({
  transaction,
  mutateOnDelete,
}: Readonly<FinancialMovementsProps>): JSX.Element {
  async function deleteTransaction(): Promise<void> {
    await deleteFetcher(`/api/transactions/${transaction.id}`);
    await mutateOnDelete();
  }

  function onEdit(): void {}

  function getDate(): string {
    if (transaction?.repeats) {
      return transaction.repeats;
    }
    if (transaction.date) {
      return formatDate(transaction.date, 'en-US');
    }
    return '';
  }

  return (
    <div className="grid grid-cols-3 border-b-2 border-gray-500 text-lg">
      <div className="flex items-center justify-start gap-2">
        <BiEdit
          className="cursor-pointer text-slate-400 transition-colors duration-500 hover:text-slate-100"
          size={22}
          onClick={onEdit}
        />
        {transaction.category}
      </div>
      <div className="flex items-center justify-center">{getDate()}</div>
      <div className="flex items-center justify-end gap-1">
        <Money value={transaction.value} />
        <FcFullTrash
          data-testid="delete-icon"
          className="cursor-pointer"
          size={22}
          onClick={deleteTransaction}
        />
      </div>
    </div>
  );
}
