import Money from '@/components/Money';
import NewTransaction from '@/components/NewTransaction';
import { deleteFetcher } from '@/libs/fetchers';
import type { Transaction } from '@/types/transaction.type';
import { formatDate } from '@/utils/globalFormats';
import clsx from 'clsx';
import { useState, type JSX } from 'react';
import { BiEdit } from 'react-icons/bi';
import { FcFullTrash } from 'react-icons/fc';
import type { KeyedMutator } from 'swr';

export interface FinancialMovementsProps {
  transaction: Transaction;
  mutateOnDelete: KeyedMutator<Transaction[]>;
}

export default function FinancialMovements({
  transaction,
  mutateOnDelete,
}: Readonly<FinancialMovementsProps>): JSX.Element {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  async function deleteTransaction(): Promise<void> {
    await deleteFetcher({ path: `/transactions/${transaction.id}` });
    await mutateOnDelete();
  }

  function onEditOrClose(): void {
    setIsEditOpen((prev: boolean): boolean => !prev);
  }

  function getDate(): string {
    if (transaction.repeats) {
      const day: string = new Date(transaction.date)
        .getDate()
        .toString()
        .padStart(2, '0');
      return `Day ${day} (Monthly)`;
    }
    return formatDate(transaction.date, 'en-US');
  }

  return (
    <div className="grid grid-cols-3 border-b-2 border-gray-500 text-lg">
      <div className="flex items-center justify-start gap-2">
        <BiEdit
          className="cursor-pointer text-slate-400 transition-colors duration-500 hover:text-slate-100"
          size={22}
          onClick={onEditOrClose}
        />
        {transaction.category.name}
      </div>
      <div className="flex items-center justify-center">{getDate()}</div>
      <div className="flex items-center justify-end gap-1">
        <Money value={transaction.totalValue} />
        <FcFullTrash
          data-testid="delete-icon"
          className="cursor-pointer"
          size={22}
          onClick={deleteTransaction}
        />
      </div>
      <div
        className={clsx(
          'fixed top-0 right-0 z-10 h-full w-[400px] transform bg-black shadow-lg transition-transform md:w-[500px]',
          isEditOpen ? 'translate-x-0' : 'hidden translate-x-full'
        )}
      >
        <NewTransaction onClose={onEditOrClose} transaction={transaction} />
      </div>
    </div>
  );
}
