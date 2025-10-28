import { z } from 'zod';

export const fullNameSchema = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(64, 'Full name must not exceed 64 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes')
  .refine((value) => value.trim().length > 0, {
    message: 'Full name cannot be empty or only whitespace',
  });

export const profileFormSchema = z.object({
  full_name: fullNameSchema,
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
