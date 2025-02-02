'use client';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';
import { useState, type JSX } from 'react';
import { CgProfile } from 'react-icons/cg';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiSignOutBold } from 'react-icons/pi';
import { VscRobot } from 'react-icons/vsc';

export default function Header(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <button
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={(): void => setIsOpen(false)}
        />
      )}
      <header className="flex p-4 shadow-md">
        <button
          onClick={(): void => setIsOpen((prev: boolean): boolean => !prev)}
        >
          <VscRobot size={40} className="text-white hover:text-gray-400" />
        </button>
      </header>
      <div
        className={clsx(
          'fixed left-0 top-0 h-full w-64 transform bg-blue-950 p-6 shadow-lg transition-transform',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <p className="text-2xl font-semibold">Menu</p>
        <nav className="mt-10 flex flex-col items-start justify-start gap-3 text-lg">
          <div className="flex items-center justify-center gap-2">
            <CgProfile size={20} />
            <button>Profile</button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <IoSettingsOutline size={20} />
            <button>Settings</button>
          </div>
          <div className="flex items-center justify-center gap-2">
            <PiSignOutBold size={20} />
            <button onClick={async (): Promise<void> => await signOut()}>
              Sign-out
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
