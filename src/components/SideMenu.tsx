import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import type { ButtonHTMLAttributes, JSX } from 'react';
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
        <Button onClick={(): void => onClick('/')}>
          <FaHome size={20} />
          Home
        </Button>
        <Button onClick={(): void => onClick('/analytics')}>
          <VscGraph size={20} />
          Analytics
        </Button>
        <Button>
          <CgProfile size={20} />
          Profile
        </Button>
        <Button>
          <IoSettingsOutline size={20} />
          Settings
        </Button>
        <Button onClick={async (): Promise<void> => await signOut()}>
          <PiSignOutBold size={20} />
          Sign-out
        </Button>
      </nav>
    </div>
  );
}

function Button({
  children,
  onClick,
}: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}
