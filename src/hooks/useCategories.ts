import type { TransactionType } from '@/enums/transactionType.enum';
import { getFetcher } from '@/libs/fetchers';
import type { Category } from '@/types/category.type';
import useSWR, { type SWRResponse } from 'swr';

export default function useCategories(
  transactionType?: TransactionType
): SWRResponse<Category[], Error> {
  return useSWR(
    transactionType ? `/categories/type/${transactionType}` : null,
    (path: string): Promise<Category[]> => getFetcher<Category[]>({ path }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
