'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

import { PaletteRequestSchema } from '@/infrastructure/schemas/palette.schema';
import {
  ExplorePaletteResponse,
  PaletteRequest,
  PaletteResponse,
} from '@/infrastructure/interfaces/palette-actions.interface';

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

/**
 * Fetch paginated public palettes
 */
const getAllPalettes = async (offset: number, limit: number = 20, sortBy: 'recent' | 'mostLiked' = 'mostLiked') => {
  try {
    const supabase = await createClient();

    // Get current user to determine the liked palettes
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const from = (offset - 1) * limit;
    // Request one extra item to check if there are more items
    const to = from + limit;

    let palettesQuery = supabase.from('palettes_with_like_count').select('*').eq('is_public', true);

    if (sortBy === 'mostLiked') {
      palettesQuery = palettesQuery
        .order('like_count', { ascending: false })
        .order('created_at', { ascending: false })
        .order('id', { ascending: false });
    } else {
      palettesQuery = palettesQuery.order('created_at', { ascending: false }).order('id', { ascending: false });
    }

    const { data: palettes, error: palettesError } = await palettesQuery.range(from, to);

    if (palettesError) {
      return {
        error: 'Failed to fetch palettes',
        data: null,
        hasMore: false,
      };
    }

    if (!palettes || palettes.length === 0) {
      return {
        data: [],
        error: null,
        hasMore: false,
      };
    }

    // Check if there are more items
    const hasMore = palettes.length > limit;
    // Only return the requested number of items
    const palettesToReturn = hasMore ? palettes.slice(0, limit) : palettes;

    const paletteIds = palettesToReturn.map((palette) => palette.id);

    let likedPaletteIds = new Set<string>();

    if (user && paletteIds.length > 0) {
      const { data: likedRows, error: likedError } = await supabase
        .from('user_palette_likes')
        .select('palette_id')
        .eq('user_id', user.id)
        .in('palette_id', paletteIds);

      if (likedError) {
        return {
          error: 'Failed to fetch palettes',
          data: null,
          hasMore: false,
        };
      }
      likedPaletteIds = new Set(likedRows?.map((like) => like.palette_id) ?? []);
    }

    const palettesWithLikes: ExplorePaletteResponse[] = palettesToReturn.map((palette) => {
      return {
        ...palette,
        profile: {
          full_name: palette.full_name,
        },
        is_liked_by_user: likedPaletteIds.has(palette.id),
      };
    });

    return {
      data: palettesWithLikes,
      error: null,
      hasMore,
    };
  } catch (error) {
    console.error({ error });
    return {
      error: 'Something went wrong while fetching palettes',
      data: null,
      hasMore: false,
    };
  }
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

export { addPalette, getUserPalettes, updatePaletteVisibility, deletePalette, togglePaletteLike, getAllPalettes };
