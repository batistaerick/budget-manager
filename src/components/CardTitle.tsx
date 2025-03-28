import type { ReactNode } from 'react';

interface CardTitleProps {
  children: ReactNode;
}

export default function CardTitle({ children }: Readonly<CardTitleProps>) {
  return <h2 className="text-lg font-bold">{children}</h2>;
}
