'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/presentation/components/sidebar/Sidebar';
import { MobileHeader } from '@/presentation/components/sidebar/MobileHeader';
import { getCurrentUser } from '@/actions/auth.actions';
import { User } from '@supabase/supabase-js';

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  return (
    <div className='relative flex min-h-screen w-full overflow-x-hidden font-sans'>
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className='flex-1 flex flex-col'>
        <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className='flex-1 px-4 sm:px-6 lg:px-8 py-12'>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
