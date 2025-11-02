'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MdArrowDropDown } from 'react-icons/md';

export const ExploreFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'mostLiked';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <div className='relative w-full sm:w-auto'>
      <select
        className='w-full sm:w-40 rounded-xl border-2 border-neutral-variant bg-background h-14 pl-4 pr-12 text-base text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all cursor-pointer'
        value={currentSort}
        onChange={handleSortChange}
      >
        <option value='recent'>Recent</option>
        <option value='mostLiked'>Most Liked</option>
      </select>
      <MdArrowDropDown size={25} className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
    </div>
  );
};
