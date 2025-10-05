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
  value?: ReactNode;
  onClick?: () => void;
  setDate: Dispatch<SetStateAction<Date>>;
}

const DatePickerCustomButton: ForwardRefExoticComponent<
  DatePickerCustomButtonProps & RefAttributes<HTMLButtonElement>
> = forwardRef(
  (
    { value, onClick, setDate }: DatePickerCustomButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): JSX.Element => (
    <div className="flex items-center justify-center md:min-w-72">
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
      <button
        onClick={onClick}
        ref={ref}
        className="flex min-h-12 min-w-52 cursor-pointer items-center justify-center gap-2 hover:text-gray-300"
      >
        <FcCalendar size={25} />
        {value}
      </button>
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
    </div>
  )
);

DatePickerCustomButton.displayName = 'DatePickerCustomButton';

export default DatePickerCustomButton;
