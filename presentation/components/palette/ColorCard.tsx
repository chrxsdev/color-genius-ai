'use client';

import { useState } from 'react';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
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
    await navigator.clipboard.writeText(colorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='flex flex-col items-center gap-3'>
      {/* Color Circle */}
      <div
        className='w-32 h-32 rounded-full shadow-lg duration-200 ease-in-out hover:scale-105'
        style={{ backgroundColor: color }}
      />

      {/* Color Name with Regenerate Button */}
      <div className='flex items-center gap-2'>
        <p className='text-sm font-medium text-white'>{name}</p>
      </div>

      {/* Color Code with Copy Button */}
      <div className='flex items-center gap-2 '>
        <span className='text-xs text-control-text font-mono'>{colorValue}</span>
        <button
          onClick={handleCopy}
          className='flex items-center justify-center w-5 h-5 hover:text-primary transition-colors cursor-pointer'
        >
          {copied ? (
            <IoCheckmark className='text-sm text-primary' />
          ) : (
            <IoCopyOutline className='text-sm text-control-text' />
          )}
        </button>
      </div>
    </div>
  );
};
