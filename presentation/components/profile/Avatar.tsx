'use client';

import Image from 'next/image';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';

interface AvatarProps {
  avatarUrl: string | null;
  username: string;
}

export const Avatar = ({ avatarUrl, username }: AvatarProps) => {
  return (
    <div className='flex flex-col p-4 justify-center items-center'>
      <div className='relative'>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${username}'s avatar`}
            className='object-cover rounded-full'
            width={120}
            height={120}
          />
        ) : (
          <div className='w-[120px] h-[120px] rounded-full bg-neutral-variant/20 flex items-center justify-center'>
            <FaUser className='text-subtitle' size={50} />
          </div>
        )}
        <div className='absolute bottom-0 right-0 p-1'>
          <IoMdAddCircleOutline className='cursor-pointer text-subtitle hover:text-subtitle/90' size={25} />
        </div>
      </div>
    </div>
  );
};
