'use client';
import DatePickerDialog from '@/app/components/DatePickerDialog';
import usePredictions from '@/hooks/usePrediction';
import useTransactions from '@/hooks/useTransactions';
import { TransactionType, type Transaction } from '@prisma/client';
import dynamic from 'next/dynamic';
import { useMemo, useState, type ComponentType, type JSX } from 'react';
import type { Props } from 'react-apexcharts';

const ReactApexChart: ComponentType<Props> = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
);

export default function Analytics(): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());
  const { data: expenses } = useTransactions(TransactionType.EXPENSE, {
    startDate: new Date(),
    endDate: date,
  });
  const { data: incomes } = useTransactions(TransactionType.INCOME, {
    startDate: new Date(),
    endDate: date,
  });
  const { data: prediction } = usePredictions(date);

  const expenseCategories: string[] = useMemo(
    (): string[] =>
      expenses?.map(({ category }: Transaction): string => category) ?? [],
    [expenses]
  );
  const expenseValues: number[] = useMemo(
    (): number[] =>
      expenses?.map(({ value }: Transaction): number => value) ?? [],
    [expenses]
  );

  const chartData: Props = useMemo(
    (): Props => ({
      series: [{ name: 'Expenses', data: expenseValues }],
      options: {
        chart: { type: 'bar', height: 350 },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end',
          },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: { categories: expenseCategories },
        yaxis: { title: { text: '$ (thousands)' } },
        fill: { opacity: 1 },
        tooltip: {
          y: { formatter: (val: number): string => `$ ${val.toFixed(2)}` },
        },
      },
    }),
    [expenseCategories, expenseValues]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full justify-center">
        <DatePickerDialog
          date={date}
          setDate={setDate}
          dateFormat="MMM/yyyy"
          showMonthYearPicker
        />
      </div>
      <div className="flex w-full gap-3">
        <div className="w-full rounded-xl bg-blue-950/90">
          <div className="mx-3">
            <div className="w-full">
              <div className="no-scrollbar h-80 space-y-2 overflow-y-auto p-2">
                <span className="text-2xl">Predictions</span>
                <div>Value = {prediction?.netPrediction}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full rounded-xl bg-blue-950/90">
          <div className="mx-3">
            <div className="w-full">
              <div className="no-scrollbar h-80 space-y-2 overflow-y-auto p-2">
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
