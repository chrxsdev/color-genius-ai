import { ExplorePaletteGrid } from '@/presentation/components/explore';
import { getCurrentUser } from '@/actions/auth.actions';
import { getAllPalettes } from '@/actions/palette.actions';
import { ExploreSortedBy } from '@/infrastructure/types/filters.types';

interface ExploreContentProps {
  sortBy?: ExploreSortedBy;
}

export const ExploreContent = async ({ sortBy = 'mostLiked' }: ExploreContentProps) => {
  const palettes = await getAllPalettes(1, 20, sortBy);
  const user = await getCurrentUser();

  const isAuthenticated = !!user;

  return (
    <ExplorePaletteGrid
      palettes={palettes.data}
      error={palettes.error}
      isAuthenticated={isAuthenticated}
      sortBy={sortBy}
    />
  );
};
