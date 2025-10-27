import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth.actions';
import { getUserPalettes } from '@/actions/palette.actions';
import { PaletteList } from '@/presentation/components/dashboard';
import { ROUTES } from '@/utils/constants/routes';

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.home);
  }

  const palettes = await getUserPalettes(user.id);

  return (
    <div className='max-w-7xl mx-auto p-8'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white'>
          My Saved Palettes
        </h1>
        <p className='mt-4 text-slate-500 dark:text-slate-400'>
          Here are the color palettes you've saved. You can choose to make them public to share with the community.
        </p>
      </div>

      {/* Palette List */}
      <PaletteList initialPalettes={palettes} />
    </div>
  );
};

export default DashboardPage;
