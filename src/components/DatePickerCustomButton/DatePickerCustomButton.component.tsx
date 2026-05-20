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

export interface DatePickerCustomButtonProps {
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
    <div className="flex items-center justify-center gap-1 md:min-w-72">
      {arrows && (
        <button
          className="p-1 text-[var(--ctp-text)] transition-colors hover:text-[var(--ctp-subtext0)]"
          onClick={(): void =>
            setDate(
              (prevDate: Date): Date =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
            )
          }
          type="button"
        >
          <IoIosArrowDropleftCircle
            className="hidden cursor-pointer text-[var(--ctp-text)] hover:text-[var(--ctp-subtext0)] md:block"
            size={30}
          />
        </button>
      )}
      <button
        onClick={onClick}
        ref={ref}
        className="flex min-h-12 min-w-52 cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--ctp-surface1)] bg-[var(--ctp-base)] px-4 text-[var(--ctp-text)] shadow-sm transition-colors hover:border-[var(--ctp-blue)] hover:bg-[var(--ctp-crust)] hover:text-[var(--ctp-subtext0)] focus:border-[var(--ctp-blue)] focus:ring-2 focus:ring-[var(--ctp-blue)]/25 focus:outline-none"
      >
        <FcCalendar size={25} />
        {value}
      </button>
      {arrows && (
        <button
          className="p-1 text-[var(--ctp-text)] transition-colors hover:text-[var(--ctp-subtext0)]"
          onClick={(): void =>
            setDate(
              (prevDate: Date): Date =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
            )
          }
          type="button"
        >
          <IoIosArrowDroprightCircle
            className="hidden cursor-pointer text-[var(--ctp-text)] hover:text-[var(--ctp-subtext0)] md:block"
            size={30}
          />
        </button>
      )}
    </div>
  )
);

DatePickerCustomButton.displayName = 'DatePickerCustomButton';

export default DatePickerCustomButton;
