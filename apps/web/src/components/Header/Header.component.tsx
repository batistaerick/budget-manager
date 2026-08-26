'use client';

import { NewTransaction, SideMenu, Tooltip } from '@/components';
import { useProfileImage } from '@/hooks';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState, type JSX } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscRobot } from 'react-icons/vsc';

export default function Header(): JSX.Element {
  const { data: profileImage } = useProfileImage();

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const profileImageUrl: string | undefined = useMemo(
    (): string | undefined =>
      profileImage ? URL.createObjectURL(profileImage) : undefined,
    [profileImage]
  );

  useEffect((): (() => void) | undefined => {
    if (!profileImageUrl) {
      return undefined;
    }

    return (): void => URL.revokeObjectURL(profileImageUrl);
  }, [profileImageUrl]);

  function closeMenu(): void {
    setIsLeftOpen(false);
    setIsRightOpen(false);
  }

  return (
    <div className="relative z-30 w-full border-b border-[var(--ctp-surface1)] bg-[var(--ctp-mantle)] px-4 text-[var(--ctp-text)] shadow-md">
      {(isLeftOpen || isRightOpen) && (
        <button
          className="fixed inset-0 z-40 bg-[var(--ctp-crust)]/25 backdrop-blur-xs transition-opacity"
          onClick={closeMenu}
        />
      )}
      <header className="flex justify-between py-2">
        <Tooltip tooltip="Menu" placement="right">
          {profileImageUrl ? (
            <div className="relative h-11 w-11 cursor-pointer overflow-hidden rounded-full">
              <Image
                src={profileImageUrl}
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
              size={44}
              className="cursor-pointer rounded-md p-1 hover:text-[var(--ctp-subtext0)]"
              onClick={(): void =>
                setIsLeftOpen((prev: boolean): boolean => !prev)
              }
            />
          )}
        </Tooltip>
        <Tooltip tooltip="New transaction" placement="left">
          <AiOutlinePlus
            className="cursor-pointer rounded-md p-1 hover:text-[var(--ctp-subtext0)]"
            size={44}
            onClick={(): void =>
              setIsRightOpen((prev: boolean): boolean => !prev)
            }
          />
        </Tooltip>
      </header>
      <div
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-72 transform bg-[var(--ctp-mantle)] shadow-lg transition-transform duration-300',
          isLeftOpen
            ? 'pointer-events-auto translate-x-0'
            : 'pointer-events-none -translate-x-full'
        )}
      >
        <SideMenu onClose={closeMenu} />
      </div>
      <div
        className={clsx(
          'fixed top-0 right-0 z-50 h-full w-[400px] transform bg-[var(--ctp-mantle)] shadow-lg transition-transform duration-300 md:w-[500px]',
          isRightOpen
            ? 'pointer-events-auto translate-x-0'
            : 'pointer-events-none translate-x-full'
        )}
      >
        <NewTransaction onClose={closeMenu} />
      </div>
    </div>
  );
}
