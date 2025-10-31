'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaPalette, FaMagic, FaCompass } from 'react-icons/fa';

import { ROUTES } from '@/utils/constants/routes';
import { Logo } from '../Logo';
import { Loader } from '../Loader';
import { signOut } from '@/actions/auth.actions';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProfileData } from '@/infrastructure/interfaces/profile-actions.interface';

interface SidebarProps {
  user: ProfileData | null;
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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    {
      label: 'Explore',
      icon: <FaCompass className='h-5 w-5' />,
      href: ROUTES.explore,
    },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.home) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    setLogoutDialogOpen(true);
  };

  const confirmSignOut = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  if (isLoggingOut)
    return (
      <div className='fixed inset-0 bg-black/90 z-[60] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader className='h-12 w-12' />
          <p className='text-white text-lg font-medium'>Signing out...</p>
        </div>
      </div>
    );

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
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name ?? 'user_avatar'}
                  fill
                  className='object-cover'
                  sizes='40px'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-primary/30 text-primary text-lg font-bold'>
                  {user.full_name?.[0]?.toUpperCase() || user?.email[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='font-bold text-white truncate'>
                <Link href={ROUTES.profile}>Hello, {user.full_name?.split(' ')[0] ?? 'User'}</Link>
              </p>
              <button
                onClick={handleSignOut}
                className='text-xs text-primary hover:text-primary/90 transition-colors cursor-pointer'
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>

      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={confirmSignOut}
        title='Sign Out'
        description='Are you sure you want to sign out?'
        confirmText='Sign Out'
        cancelText='Cancel'
        variant='default'
      />
    </>
  );
};
