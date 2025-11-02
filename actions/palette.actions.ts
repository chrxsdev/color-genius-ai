'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

import { PaletteRequestSchema } from '@/infrastructure/schemas/palette.schema';
import { PaletteRequest, PaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { da } from 'zod/locales';

const addPalette = async (palette: PaletteRequest) => {
  try {
    const validatePalettePayload = PaletteRequestSchema.parse(palette);
    const supabase = await createClient();

    const { error } = await supabase.from('palettes').insert(validatePalettePayload);

    if (error) {
      return {
        error: error.message,
        code: error.code,
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/explore');
    // Return success or error
    return { success: true };
  } catch (error) {
    console.error({ error });
    throw new Error('Something went wrong while submitting the palette information');
  }
};

const getUserPalettes = async (userId: string): Promise<PaletteResponse[]> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('palettes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching palettes:', error);
      throw new Error('Failed to fetch palettes');
    }

    return data || [];
  } catch (error) {
    console.error({ error });
    throw new Error('Something went wrong while fetching palettes');
  }
};

const updatePaletteVisibility = async (paletteId: string, isPublic: boolean, userId: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('palettes')
      .update({ is_public: isPublic })
      .eq('id', paletteId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating palette visibility:', error);
      return { error: error.message };
    }

    revalidatePath('/dashboard');
    revalidatePath('/explore');
    return { success: true };
  } catch (error) {
    console.error({ error });
    throw new Error('Something went wrong while updating palette visibility');
  }
};

const deletePalette = async (paletteId: string, userId: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('palettes').delete().eq('id', paletteId).eq('user_id', userId);

    if (error) {
      console.error('Error deleting palette:', error);
      return { error: error.message };
    }

    revalidatePath('/dashboard');
    revalidatePath('/explore');
    return { success: true };
  } catch (error) {
    console.error({ error });
    throw new Error('Something went wrong while deleting palette');
  }
};

const getPublicPalettes = async (sortBy: 'recent' | 'mostLiked' = 'recent', limit: number = 20) => {
  try {
    const supabase = await createClient();

    // Get current user (may be null if not logged in)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // First get all public palettes with profile info
    const { data: palettes, error: palettesError } = await supabase
      .from('palettes')
      .select('*, user_id(full_name)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (palettesError) {
      console.error('Error fetching public palettes:', palettesError);
      return {
        error: 'Failed to fetch public palettes',
        data: null,
      };
    }

    // Get likes count and user's like status for each palette
    const palettesWithLikes = await Promise.all(
      (palettes ?? []).map(async (palette) => {
        const { count } = await supabase
          .from('user_palette_likes')
          .select('*', { count: 'exact', head: true })
          .eq('palette_id', palette.id);

        // Check if current user has liked this palette
        let isLikedByUser = false;
        if (user) {
          const { data: userLike } = await supabase
            .from('user_palette_likes')
            .select('*')
            .eq('user_id', user.id)
            .eq('palette_id', palette.id)
            .single();

          isLikedByUser = !!userLike;
        }

        return {
          ...palette,
          profile: {
            full_name: palette.user_id?.full_name,
          },
          likes_count: count ?? 0,
          is_liked_by_user: isLikedByUser,
        };
      })
    );

    // Sort based on the sortBy parameter
    if (sortBy === 'mostLiked') {
      palettesWithLikes.sort((a, b) => b.likes_count - a.likes_count);
    }
    // 'recent' is already sorted by created_at descending from the query

    return {
      data: palettesWithLikes,
      error: null,
    };
  } catch (error) {
    console.error({ error });
    return {
      error: 'Something went wrong while fetching public palettes',
      data: null,
    };
  }
};

/**
 * Fetch paginated public palettes
 */
const paginatedPalettes = async (offset: number, perPage: number = 20, sortedBy: 'recent' | 'mostLiked' = 'recent') => {
  const supabase = await createClient();

  const from = (offset - 1) * perPage;
  const to = from + perPage - 1;

  const { data } = await supabase
    .from('palettes')
    .select('*, user_id(full_name)')
    .eq('is_public', true)
    .range(from, to)
    .order('created_at', { ascending: false });
    
  return {
    data: data
      ? data?.map((palette) => ({
          ...palette,
          profile: {
            full_name: palette.user_id?.full_name,
          },
        }))
      : [],
    error: null,
  };
};

/**
 * Toggle like/unlike on a palette
 * Returns the new like status and updated count
 */
const togglePaletteLike = async (paletteId: string) => {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: 'You must be logged in to like palettes',
        data: null,
      };
    }

    // Check if user has already liked this palette
    const { data: existingLike, error: checkError } = await supabase
      .from('user_palette_likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('palette_id', paletteId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected
      console.error('Error checking like status:', checkError);
      return {
        error: 'Failed to check like status',
        data: null,
      };
    }

    let isLiked = false;

    if (existingLike) {
      // Unlike: Remove the like
      const { error: deleteError } = await supabase
        .from('user_palette_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('palette_id', paletteId);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        return {
          error: 'Failed to remove like',
          data: null,
        };
      }

      isLiked = false;
    } else {
      // Like: Add the like
      const { error: insertError } = await supabase.from('user_palette_likes').insert({
        user_id: user.id,
        palette_id: paletteId,
      });

      if (insertError) {
        console.error('Error adding like:', insertError);
        return {
          error: 'Failed to add like',
          data: null,
        };
      }

      isLiked = true;
    }

    // Get updated count
    const { count } = await supabase
      .from('user_palette_likes')
      .select('*', { count: 'exact', head: true })
      .eq('palette_id', paletteId);

    revalidatePath('/explore');

    return {
      error: null,
      data: {
        isLiked,
        likesCount: count ?? 0,
      },
    };
  } catch (error) {
    console.error('Error toggling like:', error);
    return {
      error: 'Something went wrong',
      data: null,
    };
  }
};

export {
  addPalette,
  getUserPalettes,
  updatePaletteVisibility,
  deletePalette,
  getPublicPalettes,
  togglePaletteLike,
  paginatedPalettes,
};
