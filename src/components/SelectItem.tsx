import type { ReactNode } from 'react';

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

export default function SelectItem({
  value,
  children,
}: Readonly<SelectItemProps>) {
  return <option value={value}>{children}</option>;
}
