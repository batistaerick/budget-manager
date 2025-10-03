import { LoginForm } from '@/components';
import type { JSX } from 'react';

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-gray-900/80 p-10 shadow-2xl backdrop-blur-md transition-all duration-500">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Welcome
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
