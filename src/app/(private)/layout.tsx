import '@/app/globals.css';
import { Header } from '@/components';
import type { JSX, ReactNode } from 'react';

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <section lang="en">
      <Header />
      {children}
    </section>
  );
}
