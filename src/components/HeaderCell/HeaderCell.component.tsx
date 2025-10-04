'use client';

import clsx from 'clsx';
import type { JSX } from 'react';
import type { IconType } from 'react-icons';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type SortKey = 'category' | 'notes' | 'date' | 'value';
type SortOrder = 'asc' | 'desc';

interface HeaderCellProps {
  label: string;
  keyName: SortKey;
  sortKey: SortKey;
  sortOrder: SortOrder;
  toggleSort: (key: SortKey) => void;
}

export default function HeaderCell({
  label,
  keyName,
  sortKey,
  sortOrder,
  toggleSort,
}: Readonly<HeaderCellProps>): JSX.Element {
  const active: boolean = sortKey === keyName;
  const EyeIcon: IconType = sortOrder === 'asc' ? FaChevronUp : FaChevronDown;

  return (
    <button
      className={clsx(
        'flex cursor-pointer items-center justify-center gap-2 font-bold transition-colors select-none hover:text-slate-500',
        active ? 'text-slate-100' : 'text-slate-300'
      )}
      onClick={(): void => toggleSort(keyName)}
      tabIndex={0}
      aria-pressed={active}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      {active ? <EyeIcon /> : null}
    </button>
  );
}
