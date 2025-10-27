'use client';

import React from 'react';
import { Navbar } from '@/presentation/components/Navbar';
import { Footer } from '@/presentation/components/Footer';

const SiteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='grid grid-rows-[auto_1fr_auto] min-h-[100dvh] font-sans'>
      <Navbar />
      <main className='bg-background'>{children}</main>
      <Footer />
    </section>
  );
};

export default SiteLayout;
