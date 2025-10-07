import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';

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
  authors: [{ name: 'ColorGenius Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>
      <body className={`${spaceGroteskFont.variable} font-sans antialiased`}>
        <section className='grid grid-rows-[auto_1fr_auto] min-h-[100dvh] font-sans'>
          <Navbar />
          <main className='min-h-screen bg-background'>{children}</main>
        </section>
      </body>
    </html>
  );
}
