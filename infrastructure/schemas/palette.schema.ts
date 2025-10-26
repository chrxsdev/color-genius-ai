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

/**
 * Control Color Schema Validation
 */
export const ControlColorSchema = z.object({
  brightness: z.number().min(0, 'Brightness must be greater than 0').max(100, 'Brightness must be less than 0'),
  saturation: z.number().min(0, 'Saturation must be greater than 0').max(100, 'Saturation must be less than 0'),
  warmth: z.number().min(0, 'Warmth must be greater than 0').max(100, 'Warmth must be less than 0'),
});

/**
 * Color Items Schema
 */
export const ColorItem = z.object({
  color: z
    .string()
    .min(7, 'Color Code must be at least 7 characters')
    .max(18, 'Color Code must be less than 18 characters'),
  name: z
    .string()
    .min(2, 'Color Name must be at least 2 characters')
    .max(30, 'Color Name must be less than 30 characters'),
});

/**
 * Palette Schema validation
 */
export const PaletteRequestSchema = z.object({
  palette_name: z.string(),
  colors: z.array(ColorItem).min(5, 'Must be 5 colors at least'),
  color_format: z.enum(['HEX', 'RGB']),
  rationale: z.string().nullable(),
  tags: z.array(z.string().min(2, 'Tags must be greater that two characters')),
  harmony_type: z.enum(['analogous', 'complementary', 'triadic', 'monochromatic', 'split_complementary', 'tetradic']),
  color_control: ControlColorSchema,
  user_id: z.string(),
});
