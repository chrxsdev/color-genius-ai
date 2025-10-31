import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ReduxProvider } from '@/lib/redux/provider';
import { Toaster } from '@/presentation/components/ui/sonner';

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
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
