'use client';

import { MenuButton, ThemeSwitcher } from '@/components';
import { authenticationService } from '@/services';
import { usePathname, useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaHome } from 'react-icons/fa';
import { PiSignOutBold } from 'react-icons/pi';
import { RiSafe2Line } from 'react-icons/ri';
import { VscGraph } from 'react-icons/vsc';

interface SideMenuProps {
  onClose: () => void;
}

export default function SideMenu({
  onClose,
}: Readonly<SideMenuProps>): JSX.Element {
  const pathname = usePathname();
  const { push } = useRouter();

  function isActive(path: string): boolean {
    return pathname === path;
  }

  function onClick(path: string): void {
    onClose();
    push(path);
  }

  return (
    <div className="flex h-full w-full max-w-xs flex-col bg-[var(--ctp-mantle)]/95 p-6 shadow-xl backdrop-blur-sm">
      <p className="mb-8 text-3xl font-bold text-[var(--ctp-text)]">Menu</p>
      <nav className="flex flex-col gap-3 text-lg">
        <MenuButton active={isActive('/')} onClick={(): void => onClick('/')}>
          <FaHome size={22} />
          Home
        </MenuButton>
        <MenuButton
          active={isActive('/analytics')}
          onClick={(): void => onClick('/analytics')}
        >
          <VscGraph size={22} />
          Analytics
        </MenuButton>
        <MenuButton
          active={isActive('/savings')}
          onClick={(): void => onClick('/savings')}
        >
          <RiSafe2Line size={22} />
          Savings
        </MenuButton>
        <MenuButton
          active={isActive('/profile')}
          onClick={(): void => onClick('/profile')}
        >
          <CgProfile size={22} />
          Profile
        </MenuButton>
        <MenuButton onClick={authenticationService.logout}>
          <PiSignOutBold size={22} />
          Sign Out
        </MenuButton>
      </nav>
      <div className="mt-auto pt-8">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
