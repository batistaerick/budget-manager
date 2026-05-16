import type { TransactionType } from '@/enums';
import { getFetcher } from '@/libs/fetchers.lib';
import type { Transaction } from '@/types';
import {
  getApiDate,
  type DateRangeTransactions,
} from '@/utils/globalFormats.util';
import useSWR, { type SWRResponse } from 'swr';

export default function useTransactions(
  transactionType: TransactionType,
  dates: DateRangeTransactions
): SWRResponse<Transaction[], Error> {
  const query = new URLSearchParams({
    transactionType,
    startDate: getApiDate(dates.startDate),
    endDate: getApiDate(dates.endDate),
  });

  return useSWR(
    `/transactions?${query.toString()}`,
    getFetcher<Transaction[]>,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
