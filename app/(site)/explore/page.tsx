'use client';

import { ExplorePaletteGrid } from '@/presentation/components/explore';
import { Search } from 'lucide-react';
import { MdArrowDropDown } from 'react-icons/md';

const ExplorePage = () => {
  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='w-full bg-gradient-to-b from-surface-container to-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>Explore Palettes</h1>
            <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
              Discover a world of color created by our community. Get inspired for your next project.
            </p>
          </div>

          {/* Search and Filters */}
          <div className='mt-8 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto'>
            {/* Search Input */}
            <div className='flex-1 relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
              <input
                type='text'
                placeholder='Search by name, tag, or hex...'
                className='w-full pl-12 pr-4 py-3 border-2 border-neutral-variant rounded-xl h-14 text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all'
              />
            </div>

            {/* Popular Dropdown */}
            <div className='relative w-full sm:w-auto'>
              <select
                className='w-full sm:w-auto rounded-xl border-2 border-neutral-variant bg-background h-14 pl-4 pr-12 text-base text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all cursor-pointer'
                defaultValue='popular'
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
        <ExplorePaletteGrid />
      </div>
    </div>
  );
};

export default ExplorePage;
