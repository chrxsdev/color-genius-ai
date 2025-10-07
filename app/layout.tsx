import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSansFont = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMonoFont = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
      <body className={`${geistSansFont.variable} ${geistMonoFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
