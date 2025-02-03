'use client';
import DatePickerDialog from '@/app/components/DatePickerDialog';
import usePredictions from '@/hooks/usePrediction';
import { useState, type JSX } from 'react';

export default function Analytics(): JSX.Element {
  const [date, setDate] = useState<Date>(new Date());
  const { data } = usePredictions(date);
  return (
    <div>
      <DatePickerDialog
        date={date}
        setDate={setDate}
        dateFormat="MMM/yyyy"
        showMonthYearPicker
      />
      <div>Value = {data?.netPrediction}</div>
    </div>
  );
}
