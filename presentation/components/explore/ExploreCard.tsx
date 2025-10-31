'use client';

import { Heart, Copy } from 'lucide-react';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';

// Height pattern variants for Pinterest-style layout
export type HeightPattern = 'short' | 'medium' | 'tall' | 'extra-tall';

interface ExploreCardProps {
  id: string;
  paletteName: string;
  name: string;
  colors: ColorItem[];
  likes: number;
  heightPattern?: HeightPattern;
}

// Map height patterns to Tailwind classes
const heightClasses: Record<HeightPattern, string> = {
  short: 'h-48',
  medium: 'h-64',
  tall: 'h-80',
  'extra-tall': 'h-96',
};

export const ExploreCard = ({
  id,
  paletteName,
  name,
  colors,
  likes,
  heightPattern = 'medium',
}: ExploreCardProps) => {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer ${heightClasses[heightPattern]}`}
    >
      {/* Color Stripes Background */}
      <div className='absolute inset-0 flex flex-col rounded-2xl overflow-hidden'>
        {colors.map((colorItem, index) => (
          <div
            key={`${id}-${index}`}
            className='flex-1'
            style={{ backgroundColor: colorItem.color }}
            title={colorItem.name}
          />
        ))}
      </div>

      {/* Hover Overlay */}
      <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 rounded-2xl border-2 border-white'>
        {/* Top Section: Palette Name & Username */}
        <div className='absolute top-0 left-0 right-0 p-6 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
          <h3 className='text-xl font-bold text-white mb-1 drop-shadow-lg'>{paletteName}</h3>
          <p className='text-sm text-slate-200 drop-shadow-md'>by {name}</p>
        </div>

        {/* Bottom Section: Likes */}
        <div className='absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
          <div className='flex items-center gap-2'>
            <Heart className='w-5 h-5 text-white drop-shadow-lg' />
            <span className='text-white font-medium drop-shadow-lg'>
              {likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : likes}
            </span>
          </div>

          {/* Copy Button */}
          <button
            className='p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200'
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement copy functionality
              console.log('Copy palette:', id);
            }}
            aria-label='Copy palette'
          >
            <Copy className='w-5 h-5 text-white drop-shadow-lg' />
          </button>
        </div>
      </div>
    </div>
  );
};
