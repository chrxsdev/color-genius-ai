import { openai } from '@ai-sdk/openai';

import type { LanguageModel } from 'ai';
import type { AiProviderStrategy } from '@/infrastructure/interfaces/ai-provider-strategy.interface';

/**
 * OpenAI provider strategy implementation
 * Uses OpenAI's GPT models for palette generation
 */
export class OpenAiStrategy implements AiProviderStrategy {
  private readonly model: LanguageModel;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OPENAI_API_KEY environment variable');
    }

    try {
      // Using GPT-4o as it's good for creative tasks
      this.model = openai('gpt-4o');
    } catch (error) {
      throw new Error(
        'OpenAI SDK not installed. Please run: pnpm add @ai-sdk/openai'
      );
    }
  }

  getModel = (): LanguageModel => {
    return this.model;
  };

  getProviderName = (): string => {
    return 'OpenAI (GPT-4o)';
  };
}
