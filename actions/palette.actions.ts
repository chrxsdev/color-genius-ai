'use server';

import { createClient } from '@/lib/supabase/server';

import { PaletteRequestSchema } from '@/infrastructure/schemas/palette.schema';
import { PaletteRequest } from '@/infrastructure/interfaces/palette-actions.interface';

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

export { addPalette };
