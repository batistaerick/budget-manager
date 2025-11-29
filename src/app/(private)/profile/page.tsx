import { ProfileForm } from '@/components';
import type { JSX } from 'react';

export default function ProfilePage(): JSX.Element {
  return (
    <div className="flex h-full w-full items-center justify-center pt-5">
      <div className="w-4/12 rounded-3xl bg-gray-900/80 p-10 shadow-2xl backdrop-blur-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Profile
        </h1>
        <ProfileForm />
      </div>
    </div>
  );
}
