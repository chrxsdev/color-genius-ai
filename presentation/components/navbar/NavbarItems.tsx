'use client';

import { usePathname } from 'next/navigation';

import { ROUTES } from '@/utils/constants/routes';
import { LinkButton } from '../ui/LinkButton';
import { useMemo } from 'react';

interface NavbarItemsProps {
  isAuth: boolean;
}

export const NavbarItems = ({ isAuth }: NavbarItemsProps) => {
  const pathname = usePathname();
  const isAuthPath = pathname.includes('auth');
  const userStatus = isAuth ? 'authenticated' : 'not_authenticated';

  const renderItems = useMemo(() => {
    return {
      authenticated: {
        item: (
          <>
            <LinkButton to={ROUTES.dashboard} text='Dashboard' buttonStyle='button' />
          </>
        ),
      },
      not_authenticated: {
        item: (
          <>
            {!isAuthPath && (
              <>
                <LinkButton to={ROUTES.auth.signIn} text='Sign In' buttonStyle='button' />
              </>
            )}
          </>
        ),
      },
    };
  }, [pathname]);

  return (
    <div className='flex items-center gap-x-8'>
      <LinkButton to={ROUTES.explore} text='Explore' buttonStyle='hyperlink' />
      {renderItems[userStatus].item}
    </div>
  );
};
