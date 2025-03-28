'use client';
import DatePickerCustomButton from '@/components/DatePickerCustomButton';
import { enUS } from 'date-fns/locale';
import type { Dispatch, JSX, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import { FcCalendar } from 'react-icons/fc';

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
    <div className="flex items-center gap-2">
      <FcCalendar size={25} />
      <DatePicker
        selected={date}
        onChange={(newDate: Date | null): void =>
          setDate(newDate ?? new Date())
        }
        dateFormat={dateFormat ?? 'dd/MMMM/yyyy'}
        showMonthYearPicker={showMonthYearPicker}
        customInput={<DatePickerCustomButton />}
        locale={enUS}
      />
    </div>
  );
}
