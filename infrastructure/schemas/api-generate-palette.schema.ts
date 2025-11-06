import { z } from 'zod';
import { HARMONY_TYPES } from '@/utils/constants/harmony-types';
import { PromptValidationSchema } from './prompt-validation.schema';

/**
 * Request validation schema
 */
export const GenerateRequestSchema = z.object({
  prompt: PromptValidationSchema,
  harmony: z.enum(HARMONY_TYPES.map((type) => type.value)),
  colorCount: z.number().min(3).max(8).default(5),
});
