import { MenuButton } from '@/components';
import { authenticationService } from '@/services';
import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaHome } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiSignOutBold } from 'react-icons/pi';
import { VscGraph } from 'react-icons/vsc';

interface SideMenuProps {
  onClose: () => void;
}

export default function SideMenu({
  onClose,
}: Readonly<SideMenuProps>): JSX.Element {
  function onClick(path: string): void {
    onClose();
    redirect(path);
  }

  return (
    <div className="h-full w-full max-w-xs bg-slate-900/95 p-6 shadow-xl backdrop-blur-sm">
      <p className="mb-8 text-3xl font-bold text-white">Menu</p>
      <nav className="flex flex-col gap-3 text-lg">
        <MenuButton onClick={(): void => onClick('/')}>
          <FaHome size={22} />
          Home
        </MenuButton>
        <MenuButton onClick={(): void => onClick('/analytics')}>
          <VscGraph size={22} />
          Analytics
        </MenuButton>
        <MenuButton onClick={(): void => onClick('/profile')}>
          <CgProfile size={22} />
          Profile
        </MenuButton>
        <MenuButton onClick={(): void => onClick('/settings')}>
          <IoSettingsOutline size={22} />
          Settings
        </MenuButton>
        <MenuButton onClick={authenticationService.logout}>
          <PiSignOutBold size={22} />
          Sign Out
        </MenuButton>
      </nav>
    </div>
  );
}
