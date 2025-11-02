import { ExplorePaletteGrid } from '@/presentation/components/explore';
import { getPublicPalettes } from '@/actions/palette.actions';
import { getCurrentUser } from '@/actions/auth.actions';

interface ExploreContentProps {
  sortBy?: 'recent' | 'mostLiked';
}

export const ExploreContent = async ({ sortBy = 'recent' }: ExploreContentProps) => {
  const result = await getPublicPalettes(sortBy);
  const user = await getCurrentUser();

  const isAuthenticated = !!user;

  return <ExplorePaletteGrid palettes={result.data} error={result.error} isAuthenticated={isAuthenticated} />;
};
