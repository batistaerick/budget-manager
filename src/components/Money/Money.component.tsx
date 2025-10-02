import { formatCurrency } from '@/utils/globalFormats.util';
import type { JSX } from 'react';

export interface MoneyProps {
  className?: string;
  value?: bigint | number;
}

export default function Money({
  className,
  value,
}: Readonly<MoneyProps>): JSX.Element {
  return <div className={className}>{formatCurrency(value, 'en')}</div>;
}
