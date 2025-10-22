import type { ButtonHTMLAttributes, JSX } from 'react';

export default function MenuButton({
  children,
  onClick,
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600/30 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-blue-600/50"
    >
      {children}
    </button>
  );
}
