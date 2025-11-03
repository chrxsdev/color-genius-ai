'use client';

import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { ExplorePaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { ExploreCard } from './ExploreCard';
import { AlertCircle } from 'lucide-react';
import { getHeightPattern } from '@/utils/patterns';
import { getAllPalettes } from '@/actions/palette.actions';
import { Loader } from '../Loader';

interface ExplorePaletteGridProps {
  palettes: ExplorePaletteResponse[] | null;
  error: string | null;
  isAuthenticated: boolean;
  hasMore: boolean;
  sortBy: 'recent' | 'mostLiked';
}

export const ExplorePaletteGrid = ({
  palettes,
  error,
  isAuthenticated,
  hasMore: initialHasMore,
  sortBy,
}: ExplorePaletteGridProps) => {
  const [currentPalettes, setCurrentPalettes] = useState<ExplorePaletteResponse[]>(palettes ?? []);
  const [pagesLoaded, setPagesLoaded] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [activeSort, setActiveSort] = useState<'recent' | 'mostLiked'>(sortBy);

  const { ref, inView } = useInView();

  useEffect(() => {
    setCurrentPalettes(palettes ?? []);
    setPagesLoaded(1);
    setHasMore(initialHasMore);
    setActiveSort(sortBy);
  }, [palettes, initialHasMore, sortBy]);

  const loadMorePalettes = async () => {
    if (!hasMore) {
      return;
    }

    const nextPage = pagesLoaded + 1;

    const {
      data: newPalettes,
      error: fetchError,
      hasMore: moreAvailable,
    } = await getAllPalettes(nextPage, 20, activeSort);

    setCurrentPalettes((prev: ExplorePaletteResponse[]) => [...prev, ...(newPalettes as any /** TODO: Type this! */)]);

    if (fetchError) {
      setHasMore(false);
      return;
    }

    if (!newPalettes || newPalettes.length === 0) {
      setHasMore(false);
      return;
    }

    setPagesLoaded(nextPage);
    setHasMore(moreAvailable);
  };

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
        {currentPalettes?.map((palette, index) => (
          <ExploreCard
            key={palette.id}
            id={palette.id}
            containerClassName='break-inside-avoid mb-6'
            paletteName={palette.palette_name}
            name={palette.profile?.full_name?.trim().split(' ')[0] ?? 'Anonymous'}
            colors={palette.colors}
            likes={palette.likes_count}
            isLiked={palette.is_liked_by_user}
            isAuthenticated={isAuthenticated}
            heightPattern={getHeightPattern(index)}
          />
        ))}
      </div>
      {hasMore && (
        <div className='flex justify-center items-center p-4' ref={ref}>
          <Loader className='h-10 w-10' />
        </div>
      )}
    </>
  );
};
