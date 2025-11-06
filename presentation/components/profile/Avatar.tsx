'use client';

import Image from 'next/image';
import { ChangeEvent, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { toast } from 'sonner';

import { uploadAvatar } from '@/actions/profile.actions';
import { validateImageFile } from '@/utils/image-validation';

interface AvatarProps {
  userId: string;
  avatarUrl: string | null;
  name: string;
}

export const Avatar = ({ userId, avatarUrl, name }: AvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate image
    const validation = validateImageFile(file);

    if (!validation.isValid) {
      toast.error(validation.error ?? 'Invalid file');
      return;
    }

    // Upload image automatically
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { success, message } = await uploadAvatar(userId, formData);

      if (!success) {
        toast.error(message ?? 'Failed to upload avatar');
        return;
      }

      // Show success message
      toast.success(message ?? 'Avatar uploaded successfully');
    } catch (error) {
      console.error({ error });
      toast.error('Something failed during upload');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className='flex flex-col p-6 justify-center items-center'>
      <div className='relative'>
        {avatarUrl ? (
          <div className='relative h-40 w-40 rounded-full overflow-hidden'>
            <Image
              src={avatarUrl}
              alt={`${name}-avatar`}
              className='object-cover'
              fill
              sizes='500px'
              fetchPriority='high'
            />
          </div>
        ) : (
          <div className='w-[120px] h-[120px] rounded-full bg-neutral-variant/20 flex items-center justify-center'>
            <FaUser className='text-subtitle' size={50} />
          </div>
        )}

        {/* Upload overlay when uploading */}
        {isUploading && (
          <div className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center'>
            <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin' />
          </div>
        )}

        {/* Upload button */}
        <div className='absolute bottom-0 right-0 p-1'>
          <button
            type='button'
            onClick={handleAvatarClick}
            disabled={isUploading}
            className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Upload avatar'
          >
            <IoMdAddCircleOutline className='text-white hover:text-white/90' size={25} />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/jpeg,image/jpg,image/png'
          onChange={handleFileChange}
          className='hidden'
          disabled={isUploading}
        />
      </div>

      {/* Upload status */}
      {isUploading && <p className='text-neutral text-sm mt-2'>Uploading...</p>}
    </div>
  );
};
