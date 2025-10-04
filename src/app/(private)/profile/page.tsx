import { ProfileForm } from '@/components';
import type { JSX } from 'react';

export default function ProfilePage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#032258] via-[#2a1c33] to-[#18313f] p-6">
      <div className="w-full max-w-4/12 rounded-3xl bg-gray-900/80 p-10 shadow-2xl backdrop-blur-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Profile
        </h1>
        <ProfileForm />
      </div>
    </div>
  );
}
