import { ExplorePaletteGrid } from '@/presentation/components/explore';
import { getCurrentUser } from '@/actions/auth.actions';
import { getAllPalettes } from '@/actions/palette.actions';

interface ExploreContentProps {
  sortBy?: 'recent' | 'mostLiked';
}

export const ExploreContent = async ({ sortBy = 'recent' }: ExploreContentProps) => {
  const palettes = await getAllPalettes(1, 20, sortBy);
  const user = await getCurrentUser();

  const isAuthenticated = !!user;

  return <ExplorePaletteGrid palettes={palettes.data} error={palettes.error} isAuthenticated={isAuthenticated} />;
};
