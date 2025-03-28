'use client';
import NewTransaction from '@/components/NewTransaction';
import clsx from 'clsx';
import { useState, type JSX } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscRobot } from 'react-icons/vsc';
import SideMenu from './SideMenu';

export default function Header(): JSX.Element {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  function closeMenu(): void {
    setIsLeftOpen(false);
    setIsRightOpen(false);
  }

  return (
    <>
      {(isLeftOpen || isRightOpen) && (
        <button
          className="fixed inset-0 z-10 cursor-default bg-black/50 transition-opacity"
          onClick={closeMenu}
        />
      )}
      <header className="flex justify-between px-4 py-3 shadow-md">
        <VscRobot
          size={50}
          className="cursor-pointer rounded-md bg-blue-950/50 p-1 text-white hover:text-gray-400"
          onClick={(): void => setIsLeftOpen((prev: boolean): boolean => !prev)}
        />
        <AiOutlinePlus
          className="cursor-pointer rounded-md bg-blue-950/50 p-1 text-white hover:text-gray-400"
          size={50}
          onClick={(): void =>
            setIsRightOpen((prev: boolean): boolean => !prev)
          }
        />
      </header>
      <div
        className={clsx(
          'fixed top-0 left-0 z-10 h-full w-72 transform bg-black shadow-lg transition-transform',
          isLeftOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SideMenu onClose={closeMenu} />
      </div>
      <div
        className={clsx(
          'fixed top-0 right-0 z-10 h-full w-[500px] transform bg-black shadow-lg transition-transform',
          isRightOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <NewTransaction onClose={closeMenu} />
      </div>
    </>
  );
}
