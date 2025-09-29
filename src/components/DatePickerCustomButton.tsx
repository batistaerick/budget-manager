import {
  forwardRef,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type JSX,
  type ReactNode,
  type RefAttributes,
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FcCalendar } from 'react-icons/fc';

interface DatePickerCustomButtonProps {
  value?: ReactNode;
  onClick?: () => void;
}

const DatePickerCustomButton: ForwardRefExoticComponent<
  DatePickerCustomButtonProps & RefAttributes<HTMLButtonElement>
> = forwardRef(
  (
    { value, onClick }: DatePickerCustomButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): JSX.Element => (
    <button
      onClick={onClick}
      ref={ref}
      className="flex min-h-12 min-w-52 cursor-pointer items-center justify-center gap-2"
    >
      <FcCalendar size={25} />
      {value}
    </button>
  )
);

DatePickerCustomButton.displayName = 'DatePickerCustomButton';

export default DatePickerCustomButton;
