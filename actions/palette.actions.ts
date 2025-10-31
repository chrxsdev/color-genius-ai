'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

import { PaletteRequestSchema } from '@/infrastructure/schemas/palette.schema';
import { PaletteRequest, PaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';

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

const getPublicPalettes = async () => {
  try {
    const supabase = await createClient();

    // First get all public palettes with profile info
    const { data: palettes, error: palettesError } = await supabase
      .from('palettes')
      .select('*, user_id(full_name)')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (palettesError) {
      console.error('Error fetching public palettes:', palettesError);
      return { 
        error: 'Failed to fetch public palettes', 
        data: null 
      };
    }

    // Get likes count for each palette
    const palettesWithLikes = await Promise.all(
      (palettes ?? []).map(async (palette) => {
        const { count } = await supabase
          .from('user_palette_likes')
          .select('*', { count: 'exact', head: true })
          .eq('palette_id', palette.id);

        return {
          ...palette,
          profile: {
            full_name: palette.user_id?.full_name,
          },
          likes_count: count ?? 0,
        };
      })
    );

    return { 
      data: palettesWithLikes, 
      error: null 
    };
  } catch (error) {
    console.error({ error });
    return { 
      error: 'Something went wrong while fetching public palettes', 
      data: null 
    };
  }
};

export { addPalette, getUserPalettes, updatePaletteVisibility, deletePalette, getPublicPalettes };
