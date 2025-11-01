import { Suspense } from 'react';
import { ExploreSuspenseSkeleton } from '@/presentation/components/explore';
import { MdArrowDropDown } from 'react-icons/md';
import { ExploreContent } from '../../../presentation/components/explore/ExploreContentWithSuspense';

const ExplorePage = async () => {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='w-full bg-gradient-to-b from-surface-container to-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>Explore Palettes</h1>
            <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
              Discover a world of color created by our community. Get inspired for your next project.
            </p>
          </div>

          {/* Search and Filters */}
          <div className='mt-8 flex flex-col sm:flex-row gap-4 max-w-7xl mx-auto justify-end'>
            {/* Popular Dropdown */}
            <div className='relative w-full sm:w-auto'>
              <select
                className='w-full sm:w-40 rounded-xl border-2 border-neutral-variant bg-background h-14 pl-4 pr-12 text-base text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all cursor-pointer'
                defaultValue='mostLiked'
              >
                <option value='recent'>Recent</option>
                <option value='mostLiked'>Most Liked</option>
              </select>
              <MdArrowDropDown
                size={25}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Palette Grid */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mb-12'>
        <Suspense fallback={<ExploreSuspenseSkeleton />}>
          <ExploreContent />
        </Suspense>
      </div>
    </div>
  );
};

export default ExplorePage;
