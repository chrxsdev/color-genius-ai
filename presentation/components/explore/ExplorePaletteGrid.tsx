'use client';

import { ExplorePaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { ExploreCard, HeightPattern } from './ExploreCard';
import { AlertCircle } from 'lucide-react';

interface ExplorePaletteGridProps {
  palettes: ExplorePaletteResponse[] | null;
  error: string | null;
}

// Generate a pattern sequence that repeats
const getHeightPattern = (index: number): HeightPattern => {
  const patterns: HeightPattern[] = ['short', 'tall', 'medium', 'extra-tall'];
  return patterns[index % patterns.length];
};

export const ExplorePaletteGrid = ({ palettes, error }: ExplorePaletteGridProps) => {
  // Show error message if there's an error
  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='flex flex-col items-center gap-4'>
          <AlertCircle className='w-12 h-12 text-error' />
          <p className='text-slate-400 text-lg'>Something went wrong</p>
          <p className='text-slate-500 text-sm'>{error}</p>
        </div>
      </div>
    );
  }

  if (!palettes || palettes.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-slate-400 text-lg'>No public palettes found. Be the first to share one!</p>
      </div>
    );
  }

  return (
    <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'>
      {palettes.map((palette, index) => (
        <div key={palette.id} className='break-inside-avoid'>
          <ExploreCard
            id={palette.id}
            paletteName={palette.palette_name}
            name={palette.profile?.full_name?.trim().split(' ')[0] ?? 'Anonymous'}
            colors={palette.colors}
            likes={palette.likes_count}
            heightPattern={getHeightPattern(index)}
          />
        </div>
      ))}
    </div>
  );
};
