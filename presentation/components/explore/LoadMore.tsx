'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader } from '../Loader';
import { paginatedPalettes } from '@/actions/palette.actions';
import { ExplorePaletteGrid } from './ExplorePaletteGrid';

export const LoadMore = () => {
  const [palettes, setPalettes] = useState<any>([]);
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const loadMorePalettes = async () => {
    const nextPage = pagesLoaded + 1;
    const { data: newPalettes } = await paginatedPalettes(nextPage);

    if (!newPalettes || newPalettes.length === 0) {
      setHasMore(false);
      return;
    }

    setPalettes((prev: any) => [...prev, ...newPalettes]);
    setPagesLoaded(nextPage);
  };

  useEffect(() => {
    if (inView) {
      loadMorePalettes();
    }
  }, [inView]);

  return (
    <>
      <ExplorePaletteGrid palettes={palettes} error={palettes.error} isAuthenticated={true} />
      {hasMore && (
        <div className='flex justify-center items-center p-4' ref={ref}>
          <Loader className='h-12 w-12' />
        </div>
      )}
    </>
  );
};
