import type { TransactionType } from '@/enums';
import { getFetcher } from '@/libs/fetchers.lib';
import type { Category } from '@/types';
import useSWR, { type SWRResponse } from 'swr';

export default function useCategories(
  transactionType?: TransactionType
): SWRResponse<Category[], Error> {
  return useSWR(
    transactionType ? `/categories/type/${transactionType}` : null,
    getFetcher<Category[]>,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
