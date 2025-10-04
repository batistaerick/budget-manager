import '@/app/globals.css';
import { Header } from '@/components';
import type { JSX, ReactNode } from 'react';

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <section lang="en" className="flex min-h-screen w-full flex-col">
      <Header />
      {children}
    </section>
  );
}
