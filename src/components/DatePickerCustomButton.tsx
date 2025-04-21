import {
  forwardRef,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type JSX,
  type ReactNode,
  type RefAttributes,
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';

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
    <button onClick={onClick} ref={ref} className="cursor-pointer">
      {value}
    </button>
  )
);

DatePickerCustomButton.displayName = 'DatePickerCustomButton';

export default DatePickerCustomButton;
