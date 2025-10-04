'use client';

import type { Transaction } from '@/types';
import { PieChart, type ChartsLegendSlotProps } from '@mui/x-charts';
import { useMemo, type JSX } from 'react';

interface PieChartDataType {
  id: string;
  value: number;
  label: string;
}

interface PieChartProps {
  transactions: Transaction[];
  typography?: string;
}

export default function PieChartTransactions({
  transactions,
  typography,
}: Readonly<PieChartProps>): JSX.Element {
  function groupByCategory(): PieChartDataType[] {
    return Object.values(
      transactions.reduce(
        (
          accumulator: Record<string, PieChartDataType>,
          {
            category: { name },
            totalValue,
            installments,
            installmentNumbers,
          }: Transaction
        ): Record<string, PieChartDataType> => {
          if (!accumulator[name]) {
            accumulator[name] = { id: name, label: name, value: 0 };
          }
          if (installmentNumbers && installments) {
            accumulator[name].value += Number(installments[0].amount);
          } else {
            accumulator[name].value += Number(totalValue);
          }
          return accumulator;
        },
        {} as Record<string, PieChartDataType>
      )
    );
  }

  const groupedTransactions: PieChartDataType[] = useMemo(
    (): PieChartDataType[] =>
      groupByCategory().sort(
        (a: PieChartDataType, b: PieChartDataType): number => b.value - a.value
      ),
    [transactions]
  );

  const darkColors: string[] = [
    '#433cae',
    '#1c6db8',
    '#32b3e0',
    '#089477',
    '#2ead28',
    '#fdf800',
    '#fa8726',
    '#eb1f25',
    '#d30f73',
    '#823cc1',
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {typography}
      <PieChart
        className="chart-container"
        colors={darkColors}
        series={[{ data: groupedTransactions }]}
        width={150}
        height={150}
        slotProps={{ legend: { hidden: true } } as ChartsLegendSlotProps}
      />
    </div>
  );
}
