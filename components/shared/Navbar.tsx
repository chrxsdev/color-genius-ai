import Link from 'next/link';
import { Logo } from './Logo';

export const Navbar = () => {
  return (
    <header className='flex justify-between items-center px-4 md:px-8 lg:px-16 py-2'>
      <Logo />
      <div>
        <Link href='/explore' className='text-white hover:text-foreground px-4'>
          Explore
        </Link>
      </div>
    </header>
  );
};
