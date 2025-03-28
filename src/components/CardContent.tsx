import type { ReactNode } from 'react';

interface CardContentProps {
  children: ReactNode;
}

export default function CardContent({ children }: Readonly<CardContentProps>) {
  return <div>{children}</div>;
}
