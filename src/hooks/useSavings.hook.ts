import { getFetcher } from '@/libs/fetchers.lib';
import type { Saving } from '@/types';
import useSWR, { type SWRResponse } from 'swr';

export default function useSavings(): SWRResponse<Saving[], Error> {
  return useSWR('/savings', getFetcher<Saving[]>, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
