import React, { Suspense } from 'react';
import { Navbar } from '@/presentation/components/navbar/Navbar';
import { Footer } from '@/presentation/components/Footer';

const SiteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='grid grid-rows-[auto_1fr_auto] min-h-[100dvh] font-sans'>
      <Navbar />
      <main className='bg-background'>
        <Suspense>{children}</Suspense>
      </main>
      <Footer />
    </section>
  );
};

export default SiteLayout;
