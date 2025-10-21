'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { ROUTES } from '@/utils/constants/routes';

export const Navbar = () => {
  const pathname = usePathname();
  const isAuthPath = pathname.includes('auth');
  
  return (
    <header className='flex justify-between items-center px-4 md:px-8 lg:px-16 py-2 bg-background'>
      <Logo />
      <div className='flex items-center gap-4'>
        <Link href={ROUTES.explore} className='text-white text-sm hover:text-primary transition-colors px-4'>
          Explore
        </Link>
        {!isAuthPath && (
          <Link
            href={ROUTES.auth.signIn}
            className='flex h-10 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-bold text-button-text transition-colors duration-200 ease-in-out hover:bg-primary/90 cursor-pointer'
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
