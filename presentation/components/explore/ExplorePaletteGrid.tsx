'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

import { ExplorePaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { ExploreCard } from './ExploreCard';
import { AlertCircle } from 'lucide-react';
import { getAllPalettes } from '@/actions/palette.actions';
import { Loader } from '../Loader';
import type { ExploreSortedBy, HeightPattern } from '@/infrastructure/types/filters.types';
import { getHeightPattern } from '@/utils/patterns';
import { getResponsiveColumnCount } from '@/utils/utils';

interface PaletteLayoutItem {
  data: ExplorePaletteResponse;
  heightPattern: HeightPattern;
  positionIndex: number;
}

interface ExplorePaletteGridProps {
  palettes: ExplorePaletteResponse[] | null;
  error: string | null;
  isAuthenticated: boolean;
  sortBy: ExploreSortedBy;
}

export const ExplorePaletteGrid = ({ palettes, error, isAuthenticated, sortBy }: ExplorePaletteGridProps) => {
  const [currentPalettes, setCurrentPalettes] = useState<PaletteLayoutItem[]>(() => {
    if (!palettes || palettes.length === 0) {
      return [];
    }

    return palettes.map((palette, index) => ({
      data: palette,
      heightPattern: getHeightPattern(index),
      positionIndex: index,
    }));
  });
  const [pagesLoaded, setPagesLoaded] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>((palettes?.length ?? 0) > 0);
  const [activeSort, setActiveSort] = useState<ExploreSortedBy>(sortBy);
  const [latestBatchStartIndex, setLatestBatchStartIndex] = useState<number>(0);
  const [columnCount, setColumnCount] = useState<number>(4);

  const { ref, inView } = useInView();

  useEffect(() => {
    setActiveSort(sortBy);
  }, [sortBy]);

  useEffect(() => {
    if (!palettes || palettes.length === 0) {
      setCurrentPalettes([]);
      setPagesLoaded(1);
      setHasMore(false);
      setLatestBatchStartIndex(0);
      return;
    }

    const mappedPalettes = palettes.map((palette, index) => ({
      data: palette,
      heightPattern: getHeightPattern(index),
      positionIndex: index,
    }));

    setCurrentPalettes(mappedPalettes);
    setPagesLoaded(1);
    setHasMore(true);
    setLatestBatchStartIndex(0);
  }, [palettes, sortBy]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setColumnCount((prev) => {
        const next = getResponsiveColumnCount(window.innerWidth);
        return prev === next ? prev : next;
      });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Distribute palettes across responsive columns to keep the masonry order stable.
  const columns = useMemo(() => {
    const safeColumnCount = Math.max(1, columnCount);
    const columnArray = Array.from({ length: safeColumnCount }, () => [] as PaletteLayoutItem[]);

    currentPalettes.forEach((item, index) => {
      const columnIndex = index % safeColumnCount;
      columnArray[columnIndex].push(item);
    });

    return columnArray;
  }, [columnCount, currentPalettes]);

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

    setCurrentPalettes((prev) => {
      const startIndex = prev.length;
      const palettesWithLayout = newPalettes.map((palette, index) => ({
        data: palette,
        heightPattern: getHeightPattern(startIndex + index),
        positionIndex: startIndex + index,
      }));

      setLatestBatchStartIndex(startIndex);

      return [...prev, ...palettesWithLayout];
    });
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
      <div className='flex w-full gap-6'>
        {columns.map((column, columnIndex) => (
          <div key={`explore-column-${columnIndex}`} className='flex min-w-0 flex-1 flex-col gap-6'>
            {column.map((paletteItem) => {
              const paletteData = paletteItem.data;
              const delay = Math.max(0, paletteItem.positionIndex - latestBatchStartIndex) * 0.04;

              return (
                <motion.div
                  key={paletteData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='break-inside-avoid'
                  transition={{
                    duration: 0.3,
                    delay,
                    ease: [0.3, 0, 0.2, 1],
                  }}
                >
                  <ExploreCard
                    id={paletteData.id}
                    paletteName={paletteData.palette_name}
                    name={paletteData.profile?.full_name?.trim().split(' ')[0] ?? 'Anonymous'}
                    colors={paletteData.colors}
                    likes={paletteData.like_count}
                    isLiked={paletteData.is_liked_by_user}
                    isAuthenticated={isAuthenticated}
                    heightPattern={paletteItem.heightPattern}
                  />
                </motion.div>
              );
            })}
          </div>
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
