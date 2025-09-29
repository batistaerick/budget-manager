'use client';

import clsx from 'clsx';
import { type JSX, type ReactNode } from 'react';

interface TooltipProps {
  tip: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

export default function Tooltip({
  tip,
  placement,
  children,
}: Readonly<TooltipProps>): JSX.Element {
  const tooltipClasses: string = clsx(
    'invisible absolute rounded-full bg-sky-950 px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100',
    {
      'bottom-full left-1/2 -translate-x-1/2 mt-0 mb-2': placement === 'top',
      'top-full left-1/2 -translate-x-1/2 mt-2': placement === 'bottom',
      'left-full top-1/2 -translate-y-1/2 ml-2': placement === 'right',
      'right-full top-1/2 -translate-y-1/2 mr-2': placement === 'left',
    }
  );

  return (
    <div className="group relative">
      {children}
      <span className={tooltipClasses}>{tip}</span>
    </div>
  );
}
