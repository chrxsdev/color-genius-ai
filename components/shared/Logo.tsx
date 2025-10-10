'use client';

import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <div className='p-4'>
      <Link href='/' className='flex items-center space-x-2'>
        <Image src='/logo.png' alt='ColorGeniusAI Logo' width={40} height={40} />
        <span className='text-white font-bold text-base'>ColorGeniusAI</span>
      </Link>
    </div>
  );
};
