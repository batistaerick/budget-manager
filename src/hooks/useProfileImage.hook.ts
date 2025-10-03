import { getBlobFetcher } from '@/libs/fetchers.lib';
import type { SWRResponse } from 'swr';
import useSWR from 'swr';

export default function useProfileImage(): SWRResponse<Blob, Error> {
  return useSWR('/user-image', getBlobFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
