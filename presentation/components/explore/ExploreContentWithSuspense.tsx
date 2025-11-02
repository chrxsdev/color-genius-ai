import { ExplorePaletteGrid } from '@/presentation/components/explore';
import { getPublicPalettes, paginatedPalettes } from '@/actions/palette.actions';
import { getCurrentUser } from '@/actions/auth.actions';
import { LoadMore } from './LoadMore';

interface ExploreContentProps {
  sortBy?: 'recent' | 'mostLiked';
}

export const ExploreContent = async ({ sortBy = 'recent' }: ExploreContentProps) => {
  // const result = await getPublicPalettes(sortBy);
  const palettes = await paginatedPalettes(1, 20);
  const user = await getCurrentUser();

  const isAuthenticated = !!user;

  return (
    <>
      <ExplorePaletteGrid palettes={palettes.data} error={palettes.error} isAuthenticated={isAuthenticated} />;
      <LoadMore />
    </>
  );
};
