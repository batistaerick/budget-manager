'use client';

import { DatePickerDialog, Input, SelectWithTooltip } from '@/components';
import { RepeatInterval, TransactionType } from '@/enums';
import { useCategories } from '@/hooks';
import { postFetcher, putFetcher } from '@/libs/fetchers.lib';
import type { Category, Transaction } from '@/types';
import { getApiDate, parseApiDate } from '@/utils/globalFormats.util';
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
    transaction?.date ? parseApiDate(transaction.date) : new Date()
  );
  const [transactionType, setTransactionType] = useState<TransactionType | ''>(
    form.category?.transactionType ?? ''
  );
  const { data: categories } = useCategories(
    transactionType as TransactionType
  );
  const { mutate } = useSWRConfig();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setErrorMessage('');

    const totalValue = Number(form.totalValue);
    const installmentNumbers = Number(form.installmentNumbers);

    if (!Number.isFinite(totalValue) || totalValue <= 0) {
      setErrorMessage('Value must be greater than zero.');
      return;
    }
    if (!form.category?.id) {
      setErrorMessage('Select a category.');
      return;
    }
    if (
      isInstallmentsEnabled &&
      form.installmentNumbers &&
      (!Number.isInteger(installmentNumbers) || installmentNumbers <= 1)
    ) {
      setErrorMessage('Installments must be a whole number greater than one.');
      return;
    }
    if (isSubmitting) {
      return;
    }

    const body: string = JSON.stringify({
      id: form.id,
      notes: form.notes?.trim() || null,
      totalValue,
      installmentNumbers:
        isInstallmentsEnabled && form.installmentNumbers
          ? installmentNumbers
          : null,
      installments: form.installments ?? null,
      repeats: form.repeats ?? RepeatInterval.NONE,
      category: form.category,
      date: getApiDate(date),
    });

    try {
      setIsSubmitting(true);
      if (form.id) {
        await putFetcher<Transaction>('/transactions', { body });
      } else {
        await postFetcher<Transaction>('/transactions', { body });
      }
      await mutate(
        (key: unknown): boolean =>
          typeof key === 'string' && key.startsWith('/transactions')
      );
      setForm({ repeats: RepeatInterval.NONE });
      setTransactionType('');
      onClose();
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage('Unable to save transaction.');
    } finally {
      setIsSubmitting(false);
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
    setForm(
      (prevForm: Partial<Transaction>): Partial<Transaction> => ({
        ...prevForm,
        category: undefined,
        installmentNumbers: undefined,
      })
    );
  }

  function handleOnClose(): void {
    setForm({ repeats: RepeatInterval.NONE });
    setTransactionType('');
    onClose();
  }

  const isInstallmentsEnabled: boolean = Boolean(
    form.repeats === RepeatInterval.NONE &&
    transactionType === TransactionType.EXPENSE
  );
  const totalValue = Number(form.totalValue);
  const isSaveDisabled: boolean = Boolean(
    !Number.isFinite(totalValue) || totalValue <= 0 || !form.category?.id
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[var(--ctp-surface0)]/55 p-5 text-[var(--ctp-text)] backdrop-blur-xs">
      <div className="flex items-center justify-center">
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
          icon={
            <MdEventRepeat className="text-[var(--ctp-yellow)]" size={25} />
          }
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
          icon={<GrTransaction className="text-[var(--ctp-green)]" size={25} />}
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
              ?.slice()
              .sort((a: Category, b: Category): number =>
                a.name.localeCompare(b.name)
              )
              .map(({ name, id }: Category) => ({ label: name, value: id })) ??
              []),
          ]}
          disabled={!categories?.length}
        />
        {isInstallmentsEnabled && (
          <div className="flex flex-col gap-1">
            <BsFillCreditCard2BackFill
              className="text-[var(--ctp-mauve)]"
              size={25}
            />
            <Input
              id="installmentNumbers"
              label="Number of installments"
              type="number"
              min={2}
              step={1}
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
            min={0.01}
            step={0.01}
            value={form.totalValue?.toString() ?? ''}
            onChange={handleChange}
          />
        </div>
        {errorMessage && (
          <p className="text-sm text-[var(--ctp-red)]">{errorMessage}</p>
        )}
        <div className="flex w-full items-center justify-center gap-2">
          <button
            className="h-12 w-full cursor-pointer rounded-md bg-[var(--ctp-surface1)] font-bold text-[var(--ctp-text)] hover:bg-[var(--ctp-surface2)]"
            type="button"
            onClick={handleOnClose}
          >
            Cancel
          </button>
          <button
            className={clsx(
              'h-12 w-full rounded-md font-bold',
              isSaveDisabled || isSubmitting
                ? 'cursor-not-allowed bg-[var(--ctp-surface0)] text-[var(--ctp-overlay0)]'
                : 'cursor-pointer bg-[var(--ctp-blue)] text-[var(--ctp-crust)] hover:bg-[var(--ctp-lavender)]'
            )}
            type="submit"
            form="newTransactionForm"
            disabled={isSaveDisabled || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
