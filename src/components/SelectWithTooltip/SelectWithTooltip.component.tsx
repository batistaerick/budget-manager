import { Tooltip } from '@/components';
import type { JSX } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectWithTooltipProps {
  id: string;
  tooltip: string;
  icon: React.ReactNode;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  disabled?: boolean;
}

export default function SelectWithTooltip({
  id,
  tooltip,
  icon,
  value,
  onChange,
  options,
  disabled = false,
}: Readonly<SelectWithTooltipProps>): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      {icon}
      <Tooltip placement="top" tooltip={tooltip}>
        <select
          id={id}
          className="w-full rounded-md border border-[var(--ctp-surface1)] bg-[var(--ctp-base)] p-3 text-[var(--ctp-text)] shadow-sm transition-colors focus:border-[var(--ctp-blue)] focus:ring-2 focus:ring-[var(--ctp-blue)]/25 focus:outline-none disabled:opacity-50"
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {options.map(
            ({ value, label }: Option): JSX.Element => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
        </select>
      </Tooltip>
    </div>
  );
}
