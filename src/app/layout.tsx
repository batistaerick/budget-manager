import Header from '@/app/components/Header';
import '@/app/globals.css';
import { auth } from '@/libs/auth';
import type { Metadata } from 'next';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Geist, Geist_Mono } from 'next/font/google';
import type { JSX, ReactNode } from 'react';

const geistSans: NextFontWithVariable = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono: NextFontWithVariable = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Budget App',
  description: 'Generated by Erick',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<JSX.Element> {
  const session: Session | null = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-[#020626] antialiased`}
        >
          {session && <Header />}
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
