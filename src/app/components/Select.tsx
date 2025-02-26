import type { ChangeEventHandler, ReactNode } from 'react';

interface SelectProps {
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement> | undefined;
  children: ReactNode;
}

export default function Select({
  value,
  onChange,
  children,
}: Readonly<SelectProps>) {
  return (
    <select className="rounded-sm border p-2" value={value} onChange={onChange}>
      {children}
    </select>
  );
}
