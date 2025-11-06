const Loading = () => {
  return (
    <div className='max-w-7xl mx-auto p-8'>
      {/* Header Skeleton */}
      <div className='mb-12 animate-pulse'>
        <div className='h-12 bg-neutral-variant/20 rounded-lg w-64 mb-4'></div>
        <div className='h-6 bg-neutral-variant/20 rounded-lg w-96'></div>
      </div>

      {/* Palette Cards Skeleton */}
      <div className='grid md:grid-cols-2 grid-cols-1 gap-8'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='w-full rounded-xl border border-neutral-variant/50 dark:border-neutral-variant/30 overflow-hidden shadow-sm animate-pulse'
          >
            {/* Color Preview Skeleton */}
            <div className='flex h-32'>
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className='flex-1 h-full bg-neutral-variant/30'></div>
              ))}
            </div>

            {/* Card Content Skeleton */}
            <div className='p-6 bg-background'>
              <div className='h-6 bg-neutral-variant/20 rounded-lg w-48 mb-3'></div>
              <div className='h-4 bg-neutral-variant/20 rounded-lg w-full mb-2'></div>
              <div className='h-4 bg-neutral-variant/20 rounded-lg w-3/4 mb-4'></div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-6 bg-neutral-variant/20 rounded-full'></div>
                  <div className='h-4 bg-neutral-variant/20 rounded w-24'></div>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 bg-neutral-variant/20 rounded-full'></div>
                  <div className='w-8 h-8 bg-neutral-variant/20 rounded-full'></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
