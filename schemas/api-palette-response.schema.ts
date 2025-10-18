import { z } from 'zod';

/**
 * Structured output schema for type safety
 * Ensures AI responses match expected format
 */
export const ColorSchema = z.object({
  name: z.string().min(2).max(30),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  hsl: z.object({
    h: z.number().min(0).max(359.9999),
    s: z.number().min(0).max(100),
    l: z.number().min(0).max(100),
  }),
});

export const PaletteSchema = z.object({
  colors: z.array(ColorSchema).min(3).max(8),
  rationale: z.string().min(50),
  paletteName: z.string().min(3).max(30),
  tags: z.array(z.string().min(1).max(20)).min(3).max(8),
});

/**
 * Response type inferred from schema
 */
export type PaletteResponse = z.infer<typeof PaletteSchema> & {
  metadata: {
    generatedAt: string;
  };
};
