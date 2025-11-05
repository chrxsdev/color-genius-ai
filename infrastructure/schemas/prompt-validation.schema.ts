import { z } from 'zod';

/**
 * Validation schema for user prompts
 * Ensures prompts are descriptive themes/moods, not instructions or invalid input
 */
export const PromptValidationSchema = z
  .string()
  .min(3, 'Prompt must be at least 3 characters')
  .max(50, 'Prompt must be 50 characters or less')
  .refine(
    (value) => {
      // Check for alphanumeric, spaces, and basic punctuation only
      // Allow: letters, numbers, spaces, commas, apostrophes, hyphens
      const validCharactersRegex = /^[a-zA-Z0-9\s,'\-]+$/;
      return validCharactersRegex.test(value);
    },
    {
      message: 'Prompt must contain only letters, numbers, spaces, commas, apostrophes, and hyphens',
    }
  )
  .refine(
    (value) => {
      // Detect instruction-like patterns that suggest commands rather than themes
      const instructionPatterns = [
        /\b(create|generate|make|give me|show me|build|add|remove|delete|update|change|modify)\b/i,
        /\b(how to|what is|why|when|where|who)\b/i,
        /\b(please|can you|could you|would you|will you)\b/i,
        /\b(instruction|command|task|action|step|process)\b/i,
        /\b(ignore|disregard|forget|override|bypass)\b/i,
      ];

      return !instructionPatterns.some((pattern) => pattern.test(value));
    },
    {
      message: 'Prompt should describe a mood, theme, or concept.',
    }
  )
  .refine(
    (value) => {
      // Ensure the prompt has at least one letter (not just numbers/punctuation)
      const hasLetters = /[a-zA-Z]/.test(value);
      return hasLetters;
    },
    {
      message: 'Prompt must contain at least one letter',
    }
  );

/**
 * Type for validated prompt
 */
export type ValidatedPrompt = z.infer<typeof PromptValidationSchema>;
