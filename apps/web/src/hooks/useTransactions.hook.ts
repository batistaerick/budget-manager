import type { TransactionType } from '@/enums';
import { getFetcher } from '@/libs/fetchers.lib';
import type {
  Page,
  Transaction,
  TransactionSortKey,
  TransactionSortOrder,
} from '@/types';
import {
  getApiDate,
  type DateRangeTransactions,
} from '@/utils/globalFormats.util';
import { useEffect } from 'react';
import useSWRInfinite, { type SWRInfiniteResponse } from 'swr/infinite';

interface UseTransactionsOptions {
  loadAll?: boolean;
  pageSize?: number;
  sortKey?: TransactionSortKey;
  sortOrder?: TransactionSortOrder;
}

interface UseTransactionsResponse {
  data: Transaction[] | undefined;
  error: Error | undefined;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
  mutate: SWRInfiniteResponse<Page<Transaction>, Error>['mutate'];
}

export default function useTransactions(
  transactionType: TransactionType,
  dates: DateRangeTransactions,
  {
    loadAll = false,
    pageSize = 30,
    sortKey = 'date',
    sortOrder = 'asc',
  }: UseTransactionsOptions = {}
): UseTransactionsResponse {
  function getKey(
    pageIndex: number,
    previousPage: Page<Transaction> | null
  ): string | null {
    if (previousPage?.last) {
      return null;
    }

    const query = new URLSearchParams({
      transactionType,
      startDate: getApiDate(dates.startDate),
      endDate: getApiDate(dates.endDate),
      page: pageIndex.toString(),
      size: pageSize.toString(),
      sortKey,
      sortOrder,
    });

    return `/transactions?${query.toString()}`;
  }

  const response = useSWRInfinite<Page<Transaction>, Error>(
    getKey,
    getFetcher<Page<Transaction>>,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: pages, error, mutate, setSize, size } = response;
  const lastPage = pages?.at(-1);
  const isLoadingInitialData = !pages && !error;
  const isLoadingMore = Boolean(
    isLoadingInitialData ||
    (size > 0 && pages && typeof pages[size - 1] === 'undefined')
  );

  useEffect((): void => {
    if (!loadAll || !lastPage || lastPage.last || isLoadingMore) {
      return;
    }

    void setSize((currentSize: number): number => currentSize + 1);
  }, [isLoadingMore, lastPage, loadAll, setSize]);

  return {
    data: pages?.flatMap(
      (page: Page<Transaction>): Transaction[] => page.content
    ),
    error,
    hasMore: Boolean(lastPage && !lastPage.last),
    isLoading: isLoadingInitialData,
    isLoadingMore,
    loadMore: async (): Promise<void> => {
      if (!lastPage || lastPage.last || isLoadingMore) {
        return;
      }

      await setSize((currentSize: number): number => currentSize + 1);
    },
    mutate,
  };
}
