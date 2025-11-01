'use client';

import { heightClasses } from '@/utils/constants/height-patterns';
import { getHeightPattern } from '@/utils/patterns';

interface ExploreSuspenseSkeletonProps {
  count?: number;
}

export const ExploreSuspenseSkeleton = ({ count = 12 }: ExploreSuspenseSkeletonProps) => {
  return (
    <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'>
      {Array.from({ length: count }).map((_, index) => {
        const heightPattern = getHeightPattern(index);
        return (
          <div key={index} className='break-inside-avoid'>
            <div
              className={`rounded-2xl overflow-hidden shadow-md ${heightClasses[heightPattern]} bg-neutral-variant/20 animate-pulse`}
            />
          </div>
        );
      })}
    </div>
  );
};
