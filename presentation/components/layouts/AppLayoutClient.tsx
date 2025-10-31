'use client';

import { useState } from 'react';
import { Sidebar } from '@/presentation/components/sidebar/Sidebar';
import { MobileHeader } from '@/presentation/components/sidebar/MobileHeader';
import { ProfileData } from '@/infrastructure/interfaces/profile-actions.interface';

interface AppLayoutClientProps {
  user: ProfileData | null;
  children: React.ReactNode;
}

export const AppLayoutClient = ({ user, children }: AppLayoutClientProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='relative min-h-screen w-full text-white font-sans'>
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className='md:ml-64 flex flex-col min-h-screen'>
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className='flex-1 px-4 sm:px-6 lg:px-8 py-12'>{children}</main>
      </div>
    </div>
  );
};
