'use client';

import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

import { ExplorePaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { ExploreCard } from './ExploreCard';
import { AlertCircle } from 'lucide-react';
import { getHeightPattern } from '@/utils/patterns';
import { getAllPalettes } from '@/actions/palette.actions';
import { Loader } from '../Loader';
import { ExploreSortedBy } from '@/infrastructure/types/filters.types';

interface ExplorePaletteGridProps {
  palettes: ExplorePaletteResponse[] | null;
  error: string | null;
  isAuthenticated: boolean;
  sortBy: ExploreSortedBy;
}

export const ExplorePaletteGrid = ({ palettes, error, isAuthenticated, sortBy }: ExplorePaletteGridProps) => {
  const [currentPalettes, setCurrentPalettes] = useState<ExplorePaletteResponse[]>(palettes ?? []);
  const [pagesLoaded, setPagesLoaded] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeSort, setActiveSort] = useState<ExploreSortedBy>(sortBy);
  const [previousLoadedCount, setPreviousLoadedCount] = useState<number>(0);

  const { ref, inView } = useInView();

  useEffect(() => {
    setActiveSort(sortBy);
  }, [sortBy]);

  const loadMorePalettes = useCallback(async () => {
    if (!hasMore) {
      return;
    }

    const nextPage = pagesLoaded + 1;

    const {
      data: newPalettes,
      error: fetchError,
      hasMore: moreDataAvailable,
    } = await getAllPalettes({ offset: nextPage, sortBy: activeSort });

    if (fetchError) {
      setHasMore(false);
      return;
    }

    if (!newPalettes || newPalettes.length === 0) {
      setHasMore(false);
      return;
    }

    // Track the count before adding new palettes
    setPreviousLoadedCount((prev) => prev + 20);
    setCurrentPalettes((prev: ExplorePaletteResponse[]) => [...prev, ...(newPalettes as ExplorePaletteResponse[])]);
    setPagesLoaded(nextPage);
    setHasMore(moreDataAvailable ?? false);
  }, [hasMore, pagesLoaded, activeSort]);

  useEffect(() => {
    if (!inView || !hasMore) {
      return;
    }

    loadMorePalettes();
  }, [inView, hasMore, loadMorePalettes]);

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

  return (
    <>
      <div className='columns-1 sm:columns-2 lg:columns-4 xl:columns-4 gap-6 space-y-6'>
        {currentPalettes?.map((palette, index) => {
          // Calculate the delay based on position within the current batch
          const indexInCurrentBatch = index - previousLoadedCount;
          const delay = indexInCurrentBatch * 0.03;

          return (
            <motion.div
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay,
                ease: [0.4, 0, 0.2, 1],
              }}
              className='break-inside-avoid'
              style={{ marginBottom: '1.5rem' }}
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
                heightPattern={getHeightPattern(index)}
              />
            </motion.div>
          );
        })}
      </div>
      {hasMore && (
        <div className='flex justify-center items-center p-4' ref={ref}>
          <Loader className='h-10 w-10' />
        </div>
      )}
    </>
  );
};
