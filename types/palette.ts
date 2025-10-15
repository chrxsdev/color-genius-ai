import { z } from 'zod';

export type HarmonyType =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'monochromatic'
  | 'split_complementary'
  | 'tetradic';

export type Format = 'HEX' | 'RGB';
export interface ColorHarmonyType {
  value: HarmonyType;
  label: string;
}

export const HARMONY_TYPES: ColorHarmonyType[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split_complementary', label: 'Split-Complementary' },
  { value: 'tetradic', label: 'Tetradic' },
];

export interface ColorItem {
  color: string;
  name: string;
}

/**
 * Zod schema for color name validation
 * Used for AI-generated color names
 */
export const ColorNameSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be less than 30 characters')
    .regex(/^[a-zA-Z0-9]+\s[a-zA-Z0-9]+$/, 'Name must be exactly two words')
    .describe('A creative and funny descriptive name for the color'),
});

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
