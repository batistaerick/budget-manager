import { getFetcher } from '@/libs/fetchers';
import { getLocalDate } from '@/utils/globalFormats';
import useSWR, { type SWRResponse } from 'swr';

export default function usePredictions(
  endDate: Date
): SWRResponse<{ netPrediction: number }, Error> {
  const lastDayOfMonth = new Date(endDate);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);
  lastDayOfMonth.setHours(0, 0, 0, 0);

  const lastMonth: string = getLocalDate(lastDayOfMonth);

  return useSWR(
    `/api/predictions/${lastMonth}`,
    getFetcher<{ netPrediction: number }>,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}
