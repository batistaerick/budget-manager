'use client';
import NewTransaction from '@/components/NewTransaction';
import SideMenu from '@/components/SideMenu';
import Tooltip from '@/components/Tooltip';
import clsx from 'clsx';
import { useState, type Dispatch, type JSX, type SetStateAction } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscRobot } from 'react-icons/vsc';
import DatePickerDialog from './DatePickerDialog';

export interface HomeProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}

export default function Header({
  date,
  setDate,
}: Readonly<HomeProps>): JSX.Element {
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
          <VscRobot
            size={50}
            className="cursor-pointer rounded-md p-1 hover:text-gray-400"
            onClick={(): void =>
              setIsLeftOpen((prev: boolean): boolean => !prev)
            }
          />
        </Tooltip>
        <DatePickerDialog
          date={date}
          setDate={setDate}
          dateFormat="MMMM/yyyy"
          showMonthYearPicker
        />
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
          'fixed top-0 left-0 z-10 h-full w-72 transform bg-black shadow-lg transition-transform',
          isLeftOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SideMenu onClose={closeMenu} />
      </div>
      <div
        className={clsx(
          'fixed top-0 right-0 z-10 h-full w-[400px] transform bg-black shadow-lg transition-transform md:w-[500px]',
          isRightOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <NewTransaction onClose={closeMenu} />
      </div>
    </div>
  );
}
