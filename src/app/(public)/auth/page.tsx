import { LoginForm } from '@/components';
import Image from 'next/image';
import type { JSX } from 'react';

export default function LoginPage(): JSX.Element {
  return (
    <div className="relative h-screen w-screen">
      <Image
        src="/images/AuthBackground.jpg"
        alt="Auth background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="sm:bg-opacity-90 max-w-md rounded-3xl bg-slate-950/90 px-16 pt-5 pb-16 transition-colors duration-500 lg:w-2/5">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
