import type { TransactionType } from '@/enums';
import { getFetcher } from '@/libs/fetchers.lib';
import type { Transaction } from '@/types';
import {
  getLocalDate,
  type DateRangeTransactions,
} from '@/utils/globalFormats.util';
import useSWR, { type SWRResponse } from 'swr';

export default function useTransactions(
  transactionType: TransactionType,
  dates: DateRangeTransactions
): SWRResponse<Transaction[], Error> {
  return useSWR(
    `/transactions?transactionType=${transactionType}&startDate=${getLocalDate(dates.startDate)}&endDate=${getLocalDate(dates.endDate)}`,
    getFetcher<Transaction[]>,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
