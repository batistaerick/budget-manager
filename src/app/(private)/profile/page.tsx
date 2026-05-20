import { ProfileForm } from '@/components';
import type { JSX } from 'react';

export default function ProfilePage(): JSX.Element {
  return (
    <div className="flex min-h-[calc(100vh-60px)] w-full items-start justify-center bg-gradient-to-br from-[#032258] via-[#2a1c33] to-[#18313f] pt-5">
      <div className="w-4/12 rounded-3xl border border-[var(--ctp-surface1)] bg-[var(--ctp-mantle)]/85 p-10 shadow-2xl backdrop-blur-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-[var(--ctp-text)]">
          Profile
        </h1>
        <ProfileForm />
      </div>
    </div>
  );
}
