import { signOut } from 'next-auth/react';
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
    <div className="h-full w-full bg-slate-700/35 p-5">
      <p className="text-2xl font-semibold">Menu</p>
      <nav className="mt-10 flex flex-col items-start justify-start gap-3 text-lg">
        <button
          className="flex items-center justify-center gap-2"
          onClick={(): void => onClick('/')}
        >
          <FaHome size={20} />
          Home
        </button>
        <button
          className="flex items-center justify-center gap-2"
          onClick={(): void => onClick('/analytics')}
        >
          <VscGraph size={20} />
          Analytics
        </button>
        <button className="flex items-center justify-center gap-2">
          <CgProfile size={20} />
          Profile
        </button>
        <button className="flex items-center justify-center gap-2">
          <IoSettingsOutline size={20} />
          Settings
        </button>
        <button
          className="flex items-center justify-center gap-2"
          onClick={async (): Promise<void> => await signOut()}
        >
          <PiSignOutBold size={20} />
          Sign-out
        </button>
      </nav>
    </div>
  );
}
