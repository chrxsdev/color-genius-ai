const LikesLoadingPage = () => {
  return (
    <div className='max-w-7xl mx-auto p-8'>
      {/* Header Skeleton */}
      <div className='mb-12 animate-pulse'>
        <div className='h-12 bg-neutral-variant/20 rounded-lg w-48 mb-4'></div>
        <div className='h-6 bg-neutral-variant/20 rounded-lg w-96'></div>
      </div>

      {/* Masonry Grid Skeleton */}
      <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6'>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className='rounded-2xl overflow-hidden shadow-md animate-pulse'
          >
            {/* Color Stripes Skeleton */}
            <div className='flex flex-col h-64'>
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className='flex-1 bg-neutral-variant/30'></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikesLoadingPage;
