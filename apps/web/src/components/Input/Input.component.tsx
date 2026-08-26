'use client';

import {
  useState,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
  type JSX,
} from 'react';
import type { IconType } from 'react-icons';
import { PiEyeDuotone, PiEyeSlashDuotone } from 'react-icons/pi';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({
  id,
  value,
  label,
  type,
  className,
  onKeyDown,
  onChange,
  ...props
}: Readonly<InputProps>): JSX.Element {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const EyeIcon: IconType = isPasswordVisible
    ? PiEyeDuotone
    : PiEyeSlashDuotone;

  function handleType(): HTMLInputTypeAttribute | undefined {
    if (type === 'password' && isPasswordVisible) {
      return 'text';
    }
    return type;
  }

  return (
    <div className="relative">
      <input
        className={`text-md peer block w-full appearance-none rounded-md border border-[var(--ctp-surface1)] bg-[var(--ctp-base)] px-5 pt-5 pb-1 text-[var(--ctp-text)] shadow-sm transition-colors focus:border-[var(--ctp-blue)] focus:ring-2 focus:ring-[var(--ctp-blue)]/25 focus:outline-none ${className ?? ''}`}
        placeholder=" "
        id={id}
        type={handleType()}
        value={value}
        onKeyDown={onKeyDown}
        onChange={onChange}
        {...props}
      />
      <label
        className="text-md absolute top-3 left-6 z-10 origin-[0] -translate-y-3 scale-75 transform cursor-text text-[var(--ctp-subtext0)] duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75"
        htmlFor={id}
      >
        {label}
      </label>
      {type === 'password' && (
        <div className="absolute top-4 right-3">
          <EyeIcon
            data-testid="eye-icon"
            className="cursor-pointer text-[var(--ctp-subtext0)]"
            size={22}
            onClick={(): void => setIsPasswordVisible(!isPasswordVisible)}
          />
        </div>
      )}
    </div>
  );
}
