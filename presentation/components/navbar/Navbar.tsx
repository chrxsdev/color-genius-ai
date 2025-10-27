import { getCurrentUser } from '@/actions/auth.actions';
import { Logo } from '../Logo';
import { NavbarItems } from './NavbarItems';

export const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <header className='flex justify-between items-center px-4 md:px-8 lg:px-16 py-2 bg-background'>
      <Logo />
      <NavbarItems isAuth={!!user} />
    </header>
  );
};
