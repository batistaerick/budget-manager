import '@/app/globals.css';
import Header from '@/components/Header';
import type { JSX, ReactNode } from 'react';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
