'use client';
import DatePickerCustomButton from '@/components/DatePickerCustomButton';
import { enUS } from 'date-fns/locale';
import type { Dispatch, JSX, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';

export interface DatePickerDialogProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  dateFormat?: string;
  showMonthYearPicker?: boolean;
}

export default function DatePickerDialog({
  date,
  setDate,
  dateFormat,
  showMonthYearPicker,
}: Readonly<DatePickerDialogProps>): JSX.Element {
  return (
    <div className="flex items-center justify-center rounded-xl hover:text-gray-300">
      <DatePicker
        selected={date}
        onChange={(newDate: Date | null): void =>
          setDate(newDate ?? new Date())
        }
        dateFormat={dateFormat ?? 'dd/MMMM/yyyy'}
        showMonthYearPicker={showMonthYearPicker}
        customInput={<DatePickerCustomButton />}
        locale={enUS}
        showPopperArrow={false}
      />
    </div>
  );
}
