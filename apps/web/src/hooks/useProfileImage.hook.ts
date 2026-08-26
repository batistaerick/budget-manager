import { getOptionalBlobFetcher } from '@/libs/fetchers.lib';
import useSWR, { type SWRResponse } from 'swr';

export default function useProfileImage(): SWRResponse<
  Blob | undefined,
  Error
> {
  return useSWR('/user-image', getOptionalBlobFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}
