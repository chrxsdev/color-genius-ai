import { ExplorePaletteGrid } from '@/presentation/components/explore';
import { getPublicPalettes } from '@/actions/palette.actions';
import { createClient } from '@/lib/supabase/server';

export const ExploreContent = async () => {
  const result = await getPublicPalettes();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  return <ExplorePaletteGrid palettes={result.data} error={result.error} isAuthenticated={isAuthenticated} />;
};
