'use client';

import { Input, Money } from '@/components';
import { SavingLocation } from '@/enums';
import { useSavings } from '@/hooks';
import { savingService } from '@/services';
import type { Saving } from '@/types';
import clsx from 'clsx';
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

interface SavingForm {
  amount: string;
  location: SavingLocation;
  name: string;
}

const initialForm: SavingForm = {
  amount: '',
  location: SavingLocation.INVESTMENT,
  name: '',
};

const savingLocationLabels: Record<SavingLocation, string> = {
  [SavingLocation.CASH]: 'Cash',
  [SavingLocation.CHECKING_ACCOUNT]: 'Checking',
  [SavingLocation.SAVINGS_ACCOUNT]: 'Savings',
  [SavingLocation.INVESTMENT]: 'Investments',
  [SavingLocation.OTHER]: 'Other',
};

function getSavingsTotal(savings: Saving[]): number {
  return savings.reduce(
    (total: number, saving: Saving): number => total + saving.amount,
    0
  );
}

function getSavingsByLocation(
  savings: Saving[]
): Record<SavingLocation, number> {
  return savings.reduce(
    (
      totals: Record<SavingLocation, number>,
      saving: Saving
    ): Record<SavingLocation, number> => ({
      ...totals,
      [saving.location]: totals[saving.location] + saving.amount,
    }),
    {
      [SavingLocation.CASH]: 0,
      [SavingLocation.CHECKING_ACCOUNT]: 0,
      [SavingLocation.SAVINGS_ACCOUNT]: 0,
      [SavingLocation.INVESTMENT]: 0,
      [SavingLocation.OTHER]: 0,
    }
  );
}

export default function SavingsPage(): JSX.Element {
  const { data: savings, mutate } = useSavings();
  const [form, setForm] = useState<SavingForm>(initialForm);
  const [editingSaving, setEditingSaving] = useState<Saving>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const savingsList = useMemo((): Saving[] => savings ?? [], [savings]);
  const totalSaved = getSavingsTotal(savingsList);
  const savingsByLocation = useMemo(
    (): Record<SavingLocation, number> => getSavingsByLocation(savingsList),
    [savingsList]
  );
  const isFormInvalid =
    !form.name.trim() || !form.amount || Number(form.amount) < 0;

  function handleChange({
    currentTarget: { id, value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    setForm((prev: SavingForm): SavingForm => ({ ...prev, [id]: value }));
  }

  function handleEdit(saving: Saving): void {
    setEditingSaving(saving);
    setForm({
      amount: saving.amount.toString(),
      location: saving.location,
      name: saving.name,
    });
    setErrorMessage('');
  }

  function resetForm(): void {
    setEditingSaving(undefined);
    setForm(initialForm);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setErrorMessage('');

    if (isFormInvalid) {
      setErrorMessage('Add a name and a valid amount.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        amount: Number(form.amount),
        location: form.location,
        name: form.name.trim(),
      };

      if (editingSaving) {
        await savingService.updateSaving({ ...payload, id: editingSaving.id });
      } else {
        await savingService.createSaving(payload);
      }

      resetForm();
      await mutate();
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage('Unable to save this entry.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string): Promise<void> {
    setErrorMessage('');

    try {
      await savingService.deleteSaving(id);
      if (editingSaving?.id === id) {
        resetForm();
      }
      await mutate();
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage('Unable to delete this entry.');
    }
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <section className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Total saved</span>
          <Money className="text-3xl font-semibold" value={totalSaved} />
        </div>
        <div className="rounded bg-slate-700/90 p-4">
          <span className="text-sm text-gray-300">Entries</span>
          <div className="text-3xl font-semibold">{savingsList.length}</div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded bg-slate-700/90 p-4"
        >
          <h1 className="text-base font-semibold text-gray-100">
            {editingSaving ? 'Edit saved money' : 'Add saved money'}
          </h1>
          <Input
            id="name"
            label="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            id="amount"
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
          />
          <select
            id="location"
            value={form.location}
            onChange={handleChange}
            className="rounded-md bg-neutral-700 px-4 py-3 text-white focus:ring-0 focus:outline-none"
          >
            {Object.values(SavingLocation).map(
              (location: SavingLocation): JSX.Element => (
                <option key={location} value={location}>
                  {savingLocationLabels[location]}
                </option>
              )
            )}
          </select>
          {errorMessage && (
            <span className="text-sm text-red-300">{errorMessage}</span>
          )}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button
              type="submit"
              disabled={isSaving || isFormInvalid}
              className={clsx(
                'flex items-center justify-center gap-2 rounded-md px-4 py-3 font-medium transition',
                isSaving || isFormInvalid
                  ? 'cursor-not-allowed bg-gray-600 text-gray-400'
                  : 'cursor-pointer bg-blue-700 text-white hover:bg-blue-600'
              )}
            >
              <FiPlus />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            {editingSaving && (
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer rounded-md bg-gray-700 px-4 py-3 text-white transition hover:bg-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </form>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded bg-slate-700/90 p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-300">
              By location
            </h2>
            <div className="space-y-3">
              {Object.values(SavingLocation).map(
                (location: SavingLocation): JSX.Element => (
                  <div
                    key={location}
                    className="grid grid-cols-[1fr_auto] gap-3"
                  >
                    <span className="truncate text-sm text-gray-200">
                      {savingLocationLabels[location]}
                    </span>
                    <Money
                      className="text-sm font-semibold"
                      value={savingsByLocation[location]}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded bg-slate-700/90 p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-300">
              Saved money
            </h2>
            <div className="space-y-2">
              {savingsList.map(
                (saving: Saving): JSX.Element => (
                  <div
                    key={saving.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 rounded border border-slate-600 p-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {saving.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {savingLocationLabels[saving.location]}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Money
                        className="text-sm font-semibold"
                        value={saving.amount}
                      />
                      <button
                        type="button"
                        onClick={(): void => handleEdit(saving)}
                        className="cursor-pointer rounded p-2 text-gray-200 hover:bg-slate-600"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={(): Promise<void> => handleDelete(saving.id)}
                        className="cursor-pointer rounded p-2 text-red-200 hover:bg-red-900/60"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                )
              )}
              {!savingsList.length && (
                <span className="text-sm text-gray-300">
                  No saved money added yet.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
