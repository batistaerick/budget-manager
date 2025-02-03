import { getFetcher } from '@/libs/fetchers';
import type { Transaction, TransactionType } from '@prisma/client';
import useSWR, { SWRResponse } from 'swr';

export default function useTransactions(
  transactionType: TransactionType
): SWRResponse<Transaction[], Error> {
  return useSWR(
    `/api/transactions?type=${transactionType}`,
    getFetcher<Transaction[]>,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
