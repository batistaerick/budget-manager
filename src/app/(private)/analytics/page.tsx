'use client';
import usePredictions from '@/hooks/usePrediction';
import type { JSX } from 'react';

export default function Analytics(): JSX.Element {
  const { data } = usePredictions(new Date());
  return <div>Value = {data?.netPrediction}</div>;
}
