import { z } from 'zod';

/**
 * Zod schema for palette name validation
 * Used for AI-generated palette names
 */
export const PaletteNameSchema = z.object({
  paletteName: z
    .string()
    .min(3, 'Palette name must be at least 3 characters')
    .max(25, 'Palette name must be less than 25 characters')
    .regex(/^[a-zA-Z0-9]+\s[a-zA-Z0-9]+$/, 'Palette name must be exactly two words')
    .describe('A creative and catchy name for the color palette'),
});
