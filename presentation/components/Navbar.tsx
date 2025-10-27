import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { ROUTES } from '@/utils/constants/routes';
import { LinkButton } from './ui/LinkButton';

export const Navbar = () => {
  const pathname = usePathname();
  const isAuthPath = pathname.includes('auth');

  // TODO: Check if user is auth to render or not the /dashboard link button instead of /sign-in

  return (
    <header className='flex justify-between items-center px-4 md:px-8 lg:px-16 py-2 bg-background'>
      <Logo />
      <div className='flex items-center gap-4'>
        <LinkButton to={ROUTES.explore} text='Explore' buttonStyle='hyperlink' />
        {!isAuthPath && <LinkButton to={ROUTES.auth.signIn} text='Sign In' buttonStyle='button' />}
      </div>
    </header>
  );
};
