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
    <Tooltip placement="bottom" tooltip={tooltip}>
      <div className="flex flex-col gap-1">
        {icon}
        <select
          id={id}
          className="w-full rounded-md border border-neutral-700 bg-neutral-700 p-3 text-zinc-300 focus:outline-none disabled:opacity-50"
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
      </div>
    </Tooltip>
  );
}
