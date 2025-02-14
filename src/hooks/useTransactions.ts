import { getFetcher } from '@/libs/fetchers';
import { getLocalDate } from '@/utils/globalFormats';
import type { Transaction, TransactionType } from '@prisma/client';
import useSWR, { type SWRResponse } from 'swr';

interface DateProps {
  startDate?: Date;
  endDate?: Date;
}

export default function useTransactions(
  transactionType: TransactionType,
  dates?: DateProps
): SWRResponse<Transaction[], Error> {
  function url(): string {
    const firstDayOfMonth = new Date(dates?.startDate ?? new Date());
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const lastDayOfMonth = new Date(dates?.endDate ?? new Date());
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(0);
    lastDayOfMonth.setHours(0, 0, 0, 0);

    return `/api/transactions?type=${transactionType}&startDate=${getLocalDate(firstDayOfMonth)}&endDate=${getLocalDate(lastDayOfMonth)}`;
  }

  return useSWR(url(), getFetcher<Transaction[]>, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
