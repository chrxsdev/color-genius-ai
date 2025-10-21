import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Navbar } from '@/presentation/components/Navbar';
import { Footer } from '@/presentation/components/Footer';
import { ReduxProvider } from '@/lib/redux/provider';

import './globals.css';
import 'animate.css';

const spaceGroteskFont = Space_Grotesk({
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ColorGeniusAI',
  description: 'AI-powered color palette generator',
  keywords: ['AI', 'color palette', 'design', 'generator'],
  authors: [{ name: 'chrxsdev' }],
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>
      <body suppressHydrationWarning className={`${spaceGroteskFont.variable} font-sans antialiased`}>
        <ReduxProvider>
          <section className='grid grid-rows-[auto_1fr_auto] min-h-[100dvh] font-sans'>
            <Navbar />
            <main className='bg-background'>{children}</main>
            <Footer />
          </section>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default RootLayout;
