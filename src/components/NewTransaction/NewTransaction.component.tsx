'use client';

import { DatePickerDialog, Input, SelectWithTooltip } from '@/components';
import { RepeatInterval, TransactionType } from '@/enums';
import { useCategories } from '@/hooks';
import { postFetcher, putFetcher } from '@/libs/fetchers.lib';
import type { Category, Transaction } from '@/types';
import { getLocalDate } from '@/utils/globalFormats.util';
import clsx from 'clsx';
import { useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { BsFillCreditCard2BackFill } from 'react-icons/bs';
import { FcCurrencyExchange, FcIdea, FcSurvey } from 'react-icons/fc';
import { GrTransaction } from 'react-icons/gr';
import { MdEventRepeat } from 'react-icons/md';
import { useSWRConfig } from 'swr';

export interface NewTransactionProps {
  transaction?: Transaction;
  onClose: () => void;
}

export default function NewTransaction({
  transaction,
  onClose,
}: Readonly<NewTransactionProps>): JSX.Element {
  const [form, setForm] = useState<Partial<Transaction>>(
    transaction ?? { repeats: RepeatInterval.NONE }
  );
  const [date, setDate] = useState<Date>(
    new Date(transaction?.date ?? new Date())
  );
  const [transactionType, setTransactionType] = useState<TransactionType | ''>(
    form.category?.transactionType ?? ''
  );
  const { data: categories } = useCategories(
    transactionType as TransactionType
  );
  const { mutate } = useSWRConfig();

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    const body: string = JSON.stringify({
      id: form.id,
      notes: form.notes,
      totalValue: Number(form.totalValue),
      installmentNumbers: form.installmentNumbers ?? null,
      installments: form.installments ?? null,
      repeats: form.repeats ?? RepeatInterval.NONE,
      category: form.category,
      date: getLocalDate(date).replaceAll('-', '/'),
    });

    try {
      if (!form.id) {
        await postFetcher<Transaction>('/transactions', { body });
      } else {
        await putFetcher<Transaction>('/transactions', { body });
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      await mutate((): true => true);
      setForm({ repeats: RepeatInterval.NONE });
      setTransactionType('');
    }
  }

  function handleChange({
    currentTarget: { value, id },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    setForm(
      (prevForm: Partial<Transaction> | undefined): Partial<Transaction> => ({
        ...prevForm,
        [id]:
          id === 'category'
            ? categories?.find((c: Category): boolean => c.id === value)
            : value,
      })
    );
  }

  function handleTransactionTypeChange({
    currentTarget: { value },
  }: ChangeEvent<HTMLSelectElement>): void {
    setTransactionType(value as TransactionType);
  }

  function handleOnClose(): void {
    setForm({ repeats: RepeatInterval.NONE });
    setTransactionType('');
    onClose();
  }

  const isSaveDisabled: boolean = Boolean(
    !form.totalValue || !form.category?.id
  );

  const isInstallmentsDisabled: boolean = Boolean(
    form.repeats === RepeatInterval.NONE &&
      transactionType === TransactionType.EXPENSE
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-700/35 p-5 backdrop-blur-xs">
      <div className="flex items-center justify-center rounded-full border border-gray-500 hover:border-gray-600">
        <DatePickerDialog date={date} setDate={setDate} arrows />
      </div>
      <form
        className="flex h-full w-full flex-col gap-5 rounded-lg"
        id="newTransactionForm"
        onSubmit={onSubmit}
      >
        <SelectWithTooltip
          id="repeats"
          tooltip="Does it repeat?"
          icon={<MdEventRepeat className="text-amber-900" size={25} />}
          value={form.repeats}
          onChange={handleChange}
          options={[
            { label: 'None', value: RepeatInterval.NONE },
            { label: 'Monthly', value: RepeatInterval.MONTHLY },
          ]}
        />
        <SelectWithTooltip
          id="transactionType"
          tooltip="Transaction Type"
          icon={<GrTransaction className="text-green-700" size={25} />}
          value={transactionType}
          onChange={handleTransactionTypeChange}
          options={[
            { label: 'Select a transaction type', value: '' },
            { label: 'Expense', value: 'EXPENSE' },
            { label: 'Income', value: 'INCOME' },
          ]}
        />
        <SelectWithTooltip
          id="category"
          tooltip="Transaction category"
          icon={<FcIdea size={25} />}
          value={form.category?.id || ''}
          onChange={handleChange}
          options={[
            { label: 'Select a category', value: '' },
            ...(categories
              ?.sort((a: Category, b: Category): number =>
                a.name.localeCompare(b.name)
              )
              .map(({ name, id }: Category) => ({ label: name, value: id })) ??
              []),
          ]}
          disabled={!categories?.length}
        />
        {isInstallmentsDisabled && (
          <div className="flex flex-col gap-1">
            <BsFillCreditCard2BackFill className="text-purple-600" size={25} />
            <Input
              id="installmentNumbers"
              label="Number of installments"
              type="number"
              value={form.installmentNumbers?.toString() ?? ''}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <FcSurvey size={25} />
          <Input
            id="notes"
            label="Notes"
            type="text"
            value={form.notes ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <FcCurrencyExchange size={25} />
          <Input
            className="no-spinner"
            id="totalValue"
            label="Value"
            type="number"
            value={form.totalValue?.toString() ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <button
            className="h-12 w-full cursor-pointer rounded-md bg-blue-900 font-bold"
            type="button"
            onClick={handleOnClose}
          >
            Cancel
          </button>
          <button
            className={clsx(
              'h-12 w-full rounded-md font-bold',
              isSaveDisabled
                ? 'cursor-not-allowed bg-blue-950'
                : 'cursor-pointer bg-blue-900'
            )}
            type="submit"
            form="newTransactionForm"
            disabled={isSaveDisabled}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
