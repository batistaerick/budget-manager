import { getOptionalBlobFetcher } from '@/libs/fetchers.lib';
import type { SWRResponse } from 'swr';
import useSWR from 'swr';

export default function useProfileImage(): SWRResponse<Blob | undefined, Error> {
  return useSWR('/user-image', getOptionalBlobFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
