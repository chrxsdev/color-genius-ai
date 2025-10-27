'use client';

import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPalette, FaMagic } from 'react-icons/fa';

import { ROUTES } from '@/utils/constants/routes';
import { Logo } from '../Logo';
import { signOut } from '@/actions/auth.actions';

interface SidebarProps {
  user: User | null;
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export const Sidebar = ({ user, isOpen = true, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'My Palettes',
      icon: <FaPalette className='h-5 w-5' />,
      href: ROUTES.dashboard,
    },
    {
      label: 'Generator',
      icon: <FaMagic className='h-5 w-5' />,
      href: ROUTES.home,
    },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.home) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className='fixed inset-0 bg-black/50 z-40 md:hidden' onClick={onClose} aria-hidden='true' />}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 flex-shrink-0 
          bg-background dark:bg-background-dark 
          border-r border-neutral-variant/30
          p-6 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          z-50 md:z-auto
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo & Navigation */}
        <div>
          <div className='flex items-center justify-center mb-10'>
            <Logo />
          </div>

          <nav className='flex flex-col gap-2'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-lg px-4 py-2.5 
                  text-sm font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? 'bg-primary/30 text-primary dark:bg-primary/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className='flex items-center gap-4 border-t border-neutral-variant/30 pt-6'>
            <div className='relative h-10 w-10 rounded-full overflow-hidden bg-neutral-variant/30'>
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'User Avatar'}
                  fill
                  className='object-cover'
                  sizes='40px'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-primary/30 text-primary text-lg font-bold'>
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='font-bold text-slate-800 dark:text-white truncate'>
                {user.user_metadata?.full_name || 'User'}
              </p>
              <button
                onClick={handleSignOut}
                className='text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors cursor-pointer'
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
