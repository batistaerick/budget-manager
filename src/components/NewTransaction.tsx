import DatePickerDialog from '@/components/DatePickerDialog';
import Input from '@/components/Input';
import { postFetcher, putFetcher } from '@/libs/fetchers';
import type { Transaction } from '@prisma/client';
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type JSX,
} from 'react';
import { FcCurrencyExchange, FcIdea, FcSurvey } from 'react-icons/fc';
import { useSWRConfig } from 'swr';

export interface NewTransactionProps {
  transaction?: Transaction;
  onClose: () => void;
}

export default function NewTransaction({
  transaction,
  onClose,
}: Readonly<NewTransactionProps>): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());
  const [form, setForm] = useState<Partial<Transaction> | undefined>(
    transaction ?? { category: '', notes: '', date: new Date() }
  );
  const { mutate } = useSWRConfig();

  useEffect((): void => {
    setForm(
      (prevForm: Partial<Transaction> | undefined): Partial<Transaction> => ({
        ...prevForm,
        date,
      })
    );
  }, [date]);

  const onSubmit = useCallback(
    async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
      try {
        event.preventDefault();
        if (form?.id) {
          await putFetcher<Partial<Transaction>>('/api/transactions', form);
        } else {
          await postFetcher<Partial<Transaction>>('/api/transactions', form);
        }
      } catch (error: unknown) {
        console.error(error);
      }
      await mutate((): true => true);
      setForm({
        id: undefined,
        value: undefined,
        category: '',
        notes: '',
        date,
        transactionType: undefined,
        repeats: undefined,
      });
    },
    [form, mutate, date]
  );

  function handleChange({
    currentTarget: { value, id },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    setForm(
      (prevForm: Partial<Transaction> | undefined): Partial<Transaction> => ({
        ...prevForm,
        [id]: value,
      })
    );
  }

  const isSaveDisabled: boolean = Boolean(!form?.value || !form.category);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-700/35 p-5 backdrop-blur-xs">
      <div className="flex items-center justify-center">
        <DatePickerDialog date={date} setDate={setDate} />
      </div>
      <form
        className="flex h-full w-full flex-col gap-5 rounded-lg"
        id="newTransactionForm"
        onSubmit={onSubmit}
      >
        <div>
          <FcCurrencyExchange className="mb-1" size={25} />
          <Input
            className="no-spinner"
            id="value"
            label="Value"
            type="number"
            value={form?.value?.toString() ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <FcIdea className="mb-1" size={25} />
          <Input
            id="category"
            label="Category"
            type="text"
            value={form?.category ?? ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <FcSurvey className="mb-1" size={25} />
          <Input
            id="notes"
            label="Notes"
            type="text"
            value={form?.notes ?? ''}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-zinc-300" htmlFor="transactionType">
            Transaction Type
          </label>
          <select
            id="transactionType"
            className={`w-44 rounded-md border border-neutral-700 bg-neutral-700 p-3 ${form?.transactionType ? '' : 'text-zinc-400'} `}
            value={form?.transactionType ?? ''}
            onChange={handleChange}
          >
            <option value="">Select a type</option>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-zinc-300" htmlFor="repeats">
            Repeats
          </label>
          <select
            id="repeats"
            className={`w-44 rounded-md border border-neutral-700 bg-neutral-700 p-3 ${form?.repeats ? '' : 'text-zinc-400'} `}
            value={form?.repeats ?? ''}
            onChange={handleChange}
          >
            <option value="">Select a type</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
        <div className="flex w-full items-center justify-center gap-2">
          <button
            className="h-12 w-full cursor-pointer rounded-md bg-neutral-700"
            type="button"
            onClick={(): void => onClose()}
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
