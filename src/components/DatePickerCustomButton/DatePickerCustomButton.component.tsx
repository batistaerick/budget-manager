import {
  forwardRef,
  type Dispatch,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type JSX,
  type ReactNode,
  type RefAttributes,
  type SetStateAction,
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FcCalendar } from 'react-icons/fc';
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from 'react-icons/io';

interface DatePickerCustomButtonProps {
  setDate: Dispatch<SetStateAction<Date>>;
  onClick?: () => void;
  arrows?: boolean;
  value?: ReactNode;
}

const DatePickerCustomButton: ForwardRefExoticComponent<
  DatePickerCustomButtonProps & RefAttributes<HTMLButtonElement>
> = forwardRef(
  (
    { value, onClick, setDate, arrows }: DatePickerCustomButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): JSX.Element => (
    <div className="flex items-center justify-center md:min-w-72">
      {arrows && (
        <IoIosArrowDropleftCircle
          className="hidden cursor-pointer text-slate-200 hover:text-slate-400 md:block"
          size={30}
          onClick={(): void =>
            setDate(
              (prevDate: Date): Date =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
            )
          }
        />
      )}
      <button
        onClick={onClick}
        ref={ref}
        className="flex min-h-12 min-w-52 cursor-pointer items-center justify-center gap-2 hover:text-gray-300"
      >
        <FcCalendar size={25} />
        {value}
      </button>
      {arrows && (
        <IoIosArrowDroprightCircle
          className="hidden cursor-pointer text-slate-200 hover:text-slate-400 md:block"
          size={30}
          onClick={(): void =>
            setDate(
              (prevDate: Date): Date =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
            )
          }
        />
      )}
    </div>
  )
);

DatePickerCustomButton.displayName = 'DatePickerCustomButton';

export default DatePickerCustomButton;
