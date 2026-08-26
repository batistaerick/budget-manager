import { getFetcher } from '@/libs/fetchers.lib';
import type { User } from '@/types';
import useSWR, { type SWRResponse } from 'swr';

export default function useCurrentUser(): SWRResponse<User, Error> {
  return useSWR('/users/current', getFetcher<User>, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
