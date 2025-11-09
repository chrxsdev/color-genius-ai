'use client';

import { useState } from 'react';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
import { toast } from 'sonner';
import { hexToRgb } from '@/utils/color-conversions/code-color-conversions';
import { Format } from '@/infrastructure/types/format.types';

interface ColorCardProps {
  color: string;
  name: string;
  format: Format;
}

export const ColorCard = ({ color, name, format }: ColorCardProps) => {
  const [copied, setCopied] = useState(false);

  const colorValue = format === 'HEX' ? color.toLocaleUpperCase() : hexToRgb(color);

  const handleCopy = async () => {
    if (copied) return;

    await navigator.clipboard.writeText(colorValue);
    setCopied(true);
    toast.success('Color copied to clipboard', { duration: 3000 });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className='flex flex-col items-center gap-2 sm:gap-3 w-full min-w-0'>
      {/* Color Circle */}
      <div
        className='w-30 h-30 md:w-32 md:h-32 rounded-full shadow-lg duration-200 ease-in-out hover:scale-105 flex-shrink-0'
        style={{ backgroundColor: color }}
      />

      {/* Color Name with Regenerate Button */}
      <div className='flex items-center gap-2 w-full min-w-0 max-w-full'>
        <p className='text-xs sm:text-sm font-medium text-white text-center line-clamp-2 w-full min-w-0 px-1 break-words'>{name}</p>
      </div>

      {/* Color Code with Copy Button */}
      <div className='flex items-center gap-1 sm:gap-2 w-full min-w-0 max-w-full justify-center px-1'>
        <span className='text-xs text-control-text font-mono break-all text-center min-w-0'>{colorValue}</span>
        <button
          onClick={handleCopy}
          className='flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 hover:text-primary transition-colors cursor-pointer flex-shrink-0'
        >
          {copied ? (
            <IoCheckmark className='text-xs sm:text-sm text-primary' />
          ) : (
            <IoCopyOutline className='text-xs sm:text-sm text-control-text' />
          )}
        </button>
      </div>
    </div>
  );
};
