import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'relative h-3 w-full overflow-hidden rounded-full bg-[var(--ctp-surface1)]',
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-[var(--ctp-blue)] transition-all"
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';
