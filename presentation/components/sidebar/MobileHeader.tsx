'use client';

import { FaBars } from 'react-icons/fa';
import { Logo } from '../Logo';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export const MobileHeader = ({ onMenuClick }: MobileHeaderProps) => {
  return (
    <header className='sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm md:hidden border-b border-neutral-variant/30'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <Logo />
          <button
            onClick={onMenuClick}
            className='p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors'
            aria-label='Open menu'
          >
            <FaBars className='h-6 w-6' />
          </button>
        </div>
      </div>
    </header>
  );
};
