import '@/app/globals.css';
import { Header } from '@/components';
import type { JSX, ReactNode } from 'react';

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <section className="flex min-h-screen flex-col" lang="en">
      <Header />
      <main className="min-h-0 flex-1">{children}</main>
    </section>
  );
}
