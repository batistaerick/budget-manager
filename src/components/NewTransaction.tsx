import DatePickerDialog from '@/components/DatePickerDialog';
import Input from '@/components/Input';
import Tooltip from '@/components/Tooltip';
import { RepeatInterval } from '@/enums/repeatInterval.enum';
import { TransactionType } from '@/enums/transactionType.enum';
import useCategories from '@/hooks/useCategories';
import { postFetcher, putFetcher } from '@/libs/fetchers';
import type { Category } from '@/types/category.type';
import type { Transaction } from '@/types/transaction.type';
import { getLocalDate } from '@/utils/globalFormats';
import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from 'react';
import { BsFillCreditCard2BackFill } from 'react-icons/bs';
import { FcCurrencyExchange, FcIdea, FcSurvey } from 'react-icons/fc';
import { GrTransaction } from 'react-icons/gr';
import { MdEventRepeat } from 'react-icons/md';
import { useSWRConfig } from 'swr';

export interface NewTransactionProps {
  transaction?: Partial<Transaction>;
  onClose: () => void;
}

export default function NewTransaction({
  transaction,
  onClose,
}: Readonly<NewTransactionProps>): JSX.Element {
  const [form, setForm] = useState<Partial<Transaction>>(
    transaction ?? { repeats: RepeatInterval.NONE }
  );
  const [date, setDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<TransactionType | ''>(
    form.category?.transactionType ?? ''
  );
  const { data: categories } = useCategories(
    transactionType as TransactionType
  );
  const { mutate } = useSWRConfig();

  const onSubmit: (event: FormEvent<Element>) => Promise<void> = useCallback(
    async (event: FormEvent): Promise<void> => {
      event.preventDefault();

      const payload: Partial<Transaction> = {
        notes: form.notes ?? '',
        totalValue: Number(form.totalValue),
        installmentNumbers: form.installmentNumbers ?? null,
        installments: form.installments ?? null,
        repeats: form.repeats ?? RepeatInterval.NONE,
        category: form.category,
        date: getLocalDate(date).replaceAll('-', '/'),
      };

      try {
        if (form?.id) {
          await putFetcher<Partial<Transaction>>({
            path: '/transactions',
            body: payload,
          });
        } else {
          await postFetcher<Partial<Transaction>>({
            path: '/transactions',
            body: payload,
          });
        }
      } catch (error: unknown) {
        console.error(error);
      }
      await mutate((): true => true);
      setForm({ repeats: RepeatInterval.NONE });
      setTransactionType('');
    },
    [form, mutate, date]
  );

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
    setTransactionType((value as TransactionType) || undefined);
  }

  function handleOnClose(): void {
    setForm({ repeats: RepeatInterval.NONE });
    setTransactionType('');
    onClose();
  }

  const isSaveDisabled: boolean = Boolean(
    !form?.totalValue || !form.category?.id
  );

  const isInstallmentsDisabled: boolean = Boolean(
    form.repeats === RepeatInterval.NONE &&
      transactionType === TransactionType.EXPENSE
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-700/35 p-5 backdrop-blur-xs">
      <div className="flex items-center justify-center rounded-full border border-gray-500 hover:border-gray-600">
        <DatePickerDialog date={date} setDate={setDate} />
      </div>
      <form
        className="flex h-full w-full flex-col gap-5 rounded-lg"
        id="newTransactionForm"
        onSubmit={onSubmit}
      >
        <Tooltip placement="bottom" tip="Does it repeat?">
          <div className="flex flex-col gap-1">
            <MdEventRepeat className="text-amber-900" size={25} />
            <select
              id="repeats"
              className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3 text-zinc-300"
              value={form?.repeats}
              onChange={handleChange}
            >
              <option value={RepeatInterval.NONE}>None</option>
              <option value={RepeatInterval.MONTHLY}>Monthly</option>
              <option value={RepeatInterval.WEEKLY}>Weekly</option>
              <option value={RepeatInterval.DAILY}>Daily</option>
              <option value={RepeatInterval.YEARLY}>Yearly</option>
            </select>
          </div>
        </Tooltip>
        <Tooltip placement="bottom" tip="Transaction Type">
          <div className="flex flex-col gap-1">
            <GrTransaction className="text-green-700" size={25} />
            <select
              id="transactionType"
              className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3 text-zinc-300"
              value={transactionType}
              onChange={handleTransactionTypeChange}
            >
              <option value="">Select a transaction type</option>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
        </Tooltip>
        <Tooltip placement="bottom" tip="Transaction category">
          <div className="flex flex-col gap-1">
            <FcIdea size={25} />
            <select
              id="category"
              className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3 text-zinc-300"
              value={form.category?.id}
              onChange={handleChange}
              disabled={!categories?.length}
            >
              <option value="">Select a category</option>
              {categories
                ?.sort((a: Category, b: Category): number =>
                  a.name.localeCompare(b.name)
                )
                .map(
                  (category: Category): JSX.Element => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  )
                )}
            </select>
          </div>
        </Tooltip>
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
            value={form?.notes ?? ''}
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
            value={form?.totalValue?.toString() ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <button
            className="h-12 w-full cursor-pointer rounded-md bg-neutral-700"
            type="button"
            onClick={handleOnClose}
          >
            Cancel
          </button>
          <button
            className={`${isSaveDisabled ? 'cursor-auto bg-neutral-800' : 'cursor-pointer bg-neutral-700'} h-12 w-full rounded-md`}
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
