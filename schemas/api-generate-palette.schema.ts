import { HARMONY_TYPES } from '@/constant/harmony-types';
import { z } from 'zod';

/**
 * Request validation schema
 */
export const GenerateRequestSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters').max(200, 'Prompt must be less than 200 characters'),
  harmony: z.enum(HARMONY_TYPES.map((type) => type.value)),
  colorCount: z.number().min(3).max(8).default(5),
});
