import type { ReactNode } from 'react';

interface CardHeaderProps {
  children: ReactNode;
}

export default function CardHeader({ children }: Readonly<CardHeaderProps>) {
  return <div className="mb-2 font-semibold">{children}</div>;
}
