import { z } from 'zod';
import { HARMONY_TYPES } from '@/utils/constants/harmony-types';

/**
 * Request validation schema for name regeneration
 */
export const RegenerateNameRequestSchema = z.object({
  rationale: z.string().min(10, 'Rationale must be at least 10 characters'),
  harmony: z.enum(HARMONY_TYPES.map((type) => type.value)),
  generatedNames: z.array(z.string()).optional(),
});
