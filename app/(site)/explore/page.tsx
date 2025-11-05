import { Suspense } from 'react';
import { ExploreSuspenseSkeleton, ExploreFilter } from '@/presentation/components/explore';
import { ExploreContent } from '../../../presentation/components/explore/ExploreContentWithSuspense';
import { ExploreSortedBy } from '@/infrastructure/types/filters.types';

interface ExploreParams {
  sort?: ExploreSortedBy;
}

interface ExplorePageProps {
  searchParams: Promise<ExploreParams>;
}

const ExplorePage = async ({ searchParams }: ExplorePageProps) => {
  const params = await searchParams;
  const sortBy = (params.sort === 'recent' ? 'recent' : 'mostLiked') as ExploreSortedBy;

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
            <ExploreFilter />
          </div>
        </div>
      </div>

      {/* Palette Grid */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 mb-12'>
        <Suspense key={sortBy} fallback={<ExploreSuspenseSkeleton />}>
          <ExploreContent sortBy={sortBy} />
        </Suspense>
      </div>
    </div>
  );
};

export default ExplorePage;
