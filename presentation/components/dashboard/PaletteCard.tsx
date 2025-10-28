'use client';

import { FaTrash, FaDownload } from 'react-icons/fa';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';

interface PaletteCardProps {
  id: string;
  name: string;
  rationale?: string | null;
  colors: ColorItem[];
  isPublic: boolean;
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
  onToggleVisibility,
  onDownload,
  onDelete,
}: PaletteCardProps) => {
  return (
    <div className='w-full rounded-xl border border-neutral-variant/50 dark:border-neutral-variant/30 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300'>
      {/* Color Preview */}
      <div className='flex h-32'>
        {colors.slice(0, 5).map((colorItem, index) => (
          <div
            key={index}
            className='flex-1 h-full'
            style={{ backgroundColor: colorItem.color }}
            title={colorItem.name}
          />
        ))}
      </div>

      {/* Card Content */}
      <div className='p-6 bg-background'>
        <h3 className='text-lg font-bold text-slate-900 dark:text-white'>{name}</h3>
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
              className='p-2 rounded-full hover:bg-error/20 transition-colors text-slate-500 dark:text-slate-400 hover:text-error cursor-pointer'
              aria-label='Delete palette'
            >
              <FaTrash className='text-base' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
