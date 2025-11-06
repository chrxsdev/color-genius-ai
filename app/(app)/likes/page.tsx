import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth.actions';
import { getUserLikedPalettes } from '@/actions/palette.actions';
import { LikesGrid } from '@/presentation/components/likes';
import { ROUTES } from '@/utils/constants/routes';

const LikesPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.home);
  }

  const result = await getUserLikedPalettes();
  const palettes = result.data;
  const error = result.error;

  return (
    <div className='max-w-7xl mx-auto p-8'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tighter text-white'>
          My Likes
        </h1>
        <p className='mt-4 text-slate-500 dark:text-slate-400'>
          Browse the color palettes you&apos;ve liked from the community. Unlike a palette to remove it from this collection.
        </p>
      </div>

      {/* Likes Grid */}
      <LikesGrid initialPalettes={palettes} error={error} isAuthenticated={!!user} />
    </div>
  );
};

export default LikesPage;
