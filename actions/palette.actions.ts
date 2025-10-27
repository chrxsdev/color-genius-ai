'use server';

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

    return { success: true };
  } catch (error) {
    console.error({ error });
    throw new Error('Something went wrong while updating palette visibility');
  }
};

const deletePalette = async (paletteId: string, userId: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('palettes')
      .delete()
      .eq('id', paletteId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting palette:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error({ error });
    throw new Error('Something went wrong while deleting palette');
  }
};

export { addPalette, getUserPalettes, updatePaletteVisibility, deletePalette };
