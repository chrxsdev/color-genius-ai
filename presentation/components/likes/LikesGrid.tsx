'use client';

import { useState, useOptimistic } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

import { ExplorePaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { ExploreCard } from '../explore/ExploreCard';
import { MobileTapHint } from '../ui/MobileTapHint';

interface LikesGridProps {
  initialPalettes: ExplorePaletteResponse[] | null;
  error: string | null;
  isAuthenticated: boolean;
}

export const LikesGrid = ({ initialPalettes, error, isAuthenticated }: LikesGridProps) => {
  const [optimisticPalettes, removeOptimisticPalette] = useOptimistic(
    initialPalettes ?? [],
    (state, paletteIdToRemove: string) => state.filter((p) => p.id !== paletteIdToRemove)
  );

  const handleUnlikeSuccess = (paletteId: string) => {
    // Optimistically remove the palette from the UI
    removeOptimisticPalette(paletteId);
    
    // Show success toast
    toast.success('Palette removed from your likes');
  };

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

  // Show empty state if no liked palettes
  if (!optimisticPalettes || optimisticPalettes.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='flex flex-col items-center gap-4'>
          <p className='text-slate-400 text-lg'>No liked palettes yet</p>
          <p className='text-slate-500 text-sm'>
            Start exploring and liking palettes to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MobileTapHint show={optimisticPalettes.length > 0} />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <AnimatePresence mode='popLayout'>
        {optimisticPalettes.map((palette, index) => {
          const delay = index * 0.04;

          return (
            <motion.div
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                delay,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <ExploreCard
                id={palette.id}
                containerClassName=''
                paletteName={palette.palette_name}
                name={palette.profile?.full_name?.trim().split(' ')[0] ?? 'Anonymous'}
                colors={palette.colors}
                likes={palette.like_count}
                isLiked={palette.is_liked_by_user}
                isAuthenticated={isAuthenticated}
                heightPattern='medium'
                onUnlikeSuccess={() => handleUnlikeSuccess(palette.id)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      </div>
    </>
  );
};
