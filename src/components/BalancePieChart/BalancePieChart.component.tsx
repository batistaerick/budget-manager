'use client';

import type { Transaction } from '@/types';
import { PieChart, type ChartsLegendSlotProps } from '@mui/x-charts';
import { useMemo, type JSX } from 'react';

interface PieChartDataType {
  id: string;
  value: number;
  label: string;
}

interface BalancePieChartProps {
  transactions: Transaction[];
  typography: string;
  height?: number;
  width?: number;
}

export default function BalancePieChart({
  transactions,
  typography,
  height = 180,
  width = 180,
}: Readonly<BalancePieChartProps>): JSX.Element {
  const groupedTransactions: PieChartDataType[] =
    useMemo((): PieChartDataType[] => {
      const grouped = Object.values(
        transactions.reduce(
          (
            accumulator: Partial<Record<string, PieChartDataType>>,
            {
              category: { name },
              totalValue,
              installments,
              installmentNumbers,
            }: Transaction
          ): Partial<Record<string, PieChartDataType>> => {
            if (!accumulator[name]) {
              accumulator[name] = { id: name, label: name, value: 0 };
            }
            if (installmentNumbers && installments) {
              accumulator[name].value += Number(installments[0]?.amount ?? 0);
            } else {
              accumulator[name].value += Number(totalValue);
            }
            return accumulator;
          },
          {}
        )
      ).filter((transaction): transaction is PieChartDataType =>
        Boolean(transaction)
      );

      return grouped.sort(
        (a: PieChartDataType, b: PieChartDataType): number => b.value - a.value
      );
    }, [transactions]);

  const darkColors: string[] = [
    'var(--ctp-blue)',
    'var(--ctp-mauve)',
    'var(--ctp-pink)',
    'var(--ctp-teal)',
    'var(--ctp-green)',
    'var(--ctp-yellow)',
    'var(--ctp-peach)',
    'var(--ctp-red)',
    'var(--ctp-maroon)',
    'var(--ctp-lavender)',
  ];

  return transactions.length ? (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {typography}
      <PieChart
        className="chart-container"
        colors={darkColors}
        series={[{ data: groupedTransactions }]}
        height={height}
        width={width}
        slotProps={{ legend: { hidden: true } } as ChartsLegendSlotProps}
      />
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center text-[var(--ctp-subtext1)]">
      <span>No transaction data available</span>
    </div>
  );
}
