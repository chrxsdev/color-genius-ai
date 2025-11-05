'use client';

import { useState } from 'react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
import { toast } from 'sonner';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';
import { Loader } from '../Loader';

interface PaletteCardProps {
  id: string;
  name: string;
  rationale?: string | null;
  colors: ColorItem[];
  isPublic: boolean;
  isDeleting?: boolean;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PaletteCard = ({
  id,
  name,
  rationale,
  colors,
  isPublic,
  isDeleting = false,
  onToggleVisibility,
  onDownload,
  onDelete,
}: PaletteCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyColor = async (colorHex: string, index: number) => {
    if (copiedIndex === index) return;

    await navigator.clipboard.writeText(colorHex.toUpperCase());
    setCopiedIndex(index);
    toast.success('Color copied to clipboard', { duration: 3000 });
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  return (
    <div className='w-full rounded-xl border border-neutral-variant/50 overflow-hidden shadow-sm transition-shadow duration-300'>
      {/* Color Preview */}
      <div className='flex h-32' id={id}>
        {colors.slice(0, 5).map((colorItem, index) => (
          <div
            key={index}
            className='flex-1 h-full relative group'
            style={{ backgroundColor: colorItem.color }}
            title={colorItem.name}
          >
            {/* HEX Code and Copy Button - Shows on Hover */}
            <div className='absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 p-3 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              <span className='text-sm font-mono font-medium text-white drop-shadow-lg'>
                {colorItem.color.toUpperCase()}
              </span>
              <button
                onClick={() => handleCopyColor(colorItem.color, index)}
                className='flex items-center justify-center hover:scale-110 transition-transform cursor-pointer'
                aria-label={`Copy ${colorItem.name}`}
              >
                {copiedIndex === index ? (
                  <IoCheckmark className='text-xl text-white drop-shadow-lg' />
                ) : (
                  <IoCopyOutline className='text-xl text-white drop-shadow-lg' />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Card Content */}
      <div className='p-6 bg-background'>
        <h3 className='text-lg font-bold text-white'>{name}</h3>
        {rationale && <p className='text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4 line-clamp-2'>{rationale}</p>}

        <div className='flex justify-between items-center'>
          {/* Visibility Toggle */}
          <div className='flex items-center gap-3'>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={isPublic}
                onChange={() => onToggleVisibility(id, !isPublic)}
                className='sr-only peer'
              />
              <div className="w-10 h-6 bg-neutral-variant/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
              {isPublic ? 'Public in Explore' : 'Private'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onDownload(id)}
              className='p-2 rounded-full hover:bg-secondary/20 transition-colors text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer'
              aria-label='Download palette'
            >
              <FaDownload className='text-base' />
            </button>
            <button
              onClick={() => onDelete(id)}
              disabled={isDeleting}
              className='p-2 rounded-full hover:bg-error/20 transition-colors text-slate-500 dark:text-slate-400 hover:text-error cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Delete palette'
            >
              {isDeleting ? <Loader className='w-4 h-4' /> : <FaTrash className='text-base' />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
