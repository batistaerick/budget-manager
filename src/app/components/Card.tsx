import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: Readonly<CardProps>) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">{children}</div>
  );
}
