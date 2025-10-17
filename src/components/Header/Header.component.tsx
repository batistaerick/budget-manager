'use client';

import { NewTransaction, SideMenu, Tooltip } from '@/components';
import { useProfileImage } from '@/hooks';
import clsx from 'clsx';
import Image from 'next/image';
import { useState, type JSX } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscRobot } from 'react-icons/vsc';

export default function Header(): JSX.Element {
  const { data: profileImage } = useProfileImage();

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  function closeMenu(): void {
    setIsLeftOpen(false);
    setIsRightOpen(false);
  }

  return (
    <div className="w-full bg-[#070f52] px-4">
      {(isLeftOpen || isRightOpen) && (
        <button
          className="fixed inset-0 z-10 backdrop-blur-xs transition-opacity"
          onClick={closeMenu}
        />
      )}
      <header className="flex justify-between py-3 shadow-md">
        <Tooltip tip="Menu" placement="right">
          {profileImage ? (
            <div className="relative h-12 w-12 cursor-pointer overflow-hidden rounded-full">
              <Image
                src={URL.createObjectURL(profileImage)}
                onClick={(): void =>
                  setIsLeftOpen((prev: boolean): boolean => !prev)
                }
                className="object-cover"
                alt="Profile"
                fill
              />
            </div>
          ) : (
            <VscRobot
              size={50}
              className="cursor-pointer rounded-md p-1 hover:text-gray-400"
              onClick={(): void =>
                setIsLeftOpen((prev: boolean): boolean => !prev)
              }
            />
          )}
        </Tooltip>
        <Tooltip tip="New transaction" placement="left">
          <AiOutlinePlus
            className="cursor-pointer rounded-md p-1 hover:text-gray-400"
            size={50}
            onClick={(): void =>
              setIsRightOpen((prev: boolean): boolean => !prev)
            }
          />
        </Tooltip>
      </header>
      <div
        className={clsx(
          'fixed top-0 left-0 z-10 h-full w-72 transform bg-black shadow-lg transition-transform duration-300',
          isLeftOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
        )}
      >
        {isLeftOpen && <SideMenu onClose={closeMenu} />}
      </div>
      <div
        className={clsx(
          'fixed top-0 right-0 z-10 h-full w-[400px] transform bg-black shadow-lg transition-transform duration-300 md:w-[500px]',
          isRightOpen ? 'visible translate-x-0' : 'invisible translate-x-full'
        )}
      >
        {isRightOpen && <NewTransaction onClose={closeMenu} />}
      </div>
    </div>
  );
}
