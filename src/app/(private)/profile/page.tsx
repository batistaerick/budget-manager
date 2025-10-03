import { ProfileForm } from '@/components';
import type { JSX } from 'react';

export default function ProfilePage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-6">
      <div className="w-full max-w-6/12 rounded-3xl bg-gray-900/80 p-10 shadow-2xl backdrop-blur-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Profile
        </h1>
        <ProfileForm />
      </div>
    </div>
  );
}
