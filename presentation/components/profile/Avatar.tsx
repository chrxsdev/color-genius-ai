'use client';

import Image from 'next/image';
import { IoMdAddCircleOutline } from 'react-icons/io';

export const Avatar = () => {
  return (
    <div className='flex flex-col p-4 justify-center items-center'>
      <div className='relative'>
        <Image
          src=''
          alt={'user_avatar'}
          className='object-cover rounded-full'
          width={120}
          height={120}
        />
        <div className='absolute bottom-0 right-0 p-1'>
          <IoMdAddCircleOutline className='cursor-pointer text-subtitle hover:text-subtitle/90' size={25} />
        </div>
      </div>
    </div>
  );
};
