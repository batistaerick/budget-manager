'use client';

import { Money, NewTransaction } from '@/components';
import { deleteFetcher } from '@/libs/fetchers.lib';
import type { Installment, Transaction } from '@/types';
import { formatDate, roundNumbersUp } from '@/utils/globalFormats.util';
import clsx from 'clsx';
import { useMemo, useState, type JSX } from 'react';
import { BiEdit } from 'react-icons/bi';
import { FcFullTrash } from 'react-icons/fc';
import type { KeyedMutator } from 'swr';

export interface FinancialMovementsProps {
  transaction: Transaction;
  mutateOnDelete: KeyedMutator<Transaction[]>;
  selectedDate: Date;
}

export default function FinancialMovements({
  transaction,
  mutateOnDelete,
  selectedDate,
}: Readonly<FinancialMovementsProps>): JSX.Element {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function deleteTransaction(): Promise<void> {
    setErrorMessage('');

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteFetcher(`/transactions/${transaction.id}`);
      await mutateOnDelete();
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage('Unable to delete.');
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  }

  function onEditOrClose(): void {
    setIsEditOpen((prev: boolean): boolean => !prev);
  }

  function getDate(): string {
    if (transaction.repeats !== 'NONE') {
      const day: string = new Date(transaction.date)
        .getDate()
        .toString()
        .padStart(2, '0');
      return `Day ${day} (${transaction.repeats})`;
    }
    if (currentInstallment) {
      return formatDate(currentInstallment.dueDate, 'en-US');
    }
    return formatDate(new Date(transaction.date), 'en-US');
  }

  const currentInstallment: Installment | undefined =
    transaction.installments?.find(
      (installment: Installment): boolean =>
        new Date(selectedDate).getMonth() ===
        new Date(installment.dueDate).getMonth()
    );

  const calculateInstallmentAmount: number = useMemo((): number => {
    if (transaction.installmentNumbers) {
      return roundNumbersUp(
        transaction.totalValue,
        transaction.installmentNumbers
      );
    }
    return transaction.totalValue;
  }, [transaction]);

  return (
    <div className="grid grid-cols-4 border-b-2 border-gray-500 text-lg">
      {isEditOpen && (
        <button
          className="fixed inset-0 z-10 backdrop-blur-xs transition-opacity"
          onClick={onEditOrClose}
        />
      )}
      <div className="flex items-center justify-start gap-2">
        <BiEdit
          className="cursor-pointer text-slate-300 transition-colors duration-500 hover:text-slate-500"
          size={22}
          onClick={onEditOrClose}
        />
        <span className="truncate">
          {transaction.category.name}{' '}
          {transaction.installmentNumbers &&
            `(${currentInstallment?.installmentNumber}/${transaction.installmentNumbers})`}
        </span>
      </div>
      <div className="truncate">{transaction.notes}</div>
      <div className="truncate">{getDate()}</div>
      <div className="flex items-center justify-end gap-1">
        <Money className="truncate" value={calculateInstallmentAmount} />
        {errorMessage && (
          <span className="truncate text-xs text-red-300">{errorMessage}</span>
        )}
        {isConfirmingDelete && (
          <button
            className="rounded bg-red-900 px-2 py-1 text-xs font-semibold text-white"
            disabled={isDeleting}
            onClick={deleteTransaction}
          >
            {isDeleting ? 'Deleting...' : 'Confirm'}
          </button>
        )}
        <button
          aria-label={
            isConfirmingDelete ? 'Cancel delete transaction' : 'Delete transaction'
          }
          className="cursor-pointer"
          disabled={isDeleting}
          onClick={(): void => {
            if (isConfirmingDelete) {
              setIsConfirmingDelete(false);
              return;
            }
            void deleteTransaction();
          }}
          type="button"
        >
          <FcFullTrash size={22} />
        </button>
      </div>
      <div
        className={clsx(
          'fixed top-0 right-0 z-10 h-full w-[400px] transform bg-black shadow-lg transition-transform duration-300 md:w-[500px]',
          isEditOpen ? 'visible translate-x-0' : 'invisible translate-x-full'
        )}
      >
        {isEditOpen && (
          <NewTransaction onClose={onEditOrClose} transaction={transaction} />
        )}
      </div>
    </div>
  );
}
