import clsx from 'clsx';
import type { ButtonHTMLAttributes, JSX } from 'react';

interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default function MenuButton({
  active = false,
  children,
  onClick,
}: Readonly<MenuButtonProps>): JSX.Element {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-[var(--ctp-text)] transition-colors duration-200 hover:bg-[var(--ctp-blue)]/20 focus:ring-2 focus:ring-[var(--ctp-blue)] focus:outline-none active:bg-[var(--ctp-blue)]/30',
        active && 'bg-[var(--ctp-blue)]/20'
      )}
    >
      {children}
    </button>
  );
}
