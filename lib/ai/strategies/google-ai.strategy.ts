import type { LanguageModel } from 'ai';
import { google } from '@ai-sdk/google';

import type { AiProviderStrategy } from '@/infrastructure/interfaces/ai-provider-strategy.interface';

/**
 * Google AI provider strategy implementation
 * Uses Google's Gemini models for palette generation
 */
export class GoogleAiStrategy implements AiProviderStrategy {
  private readonly model: LanguageModel;

  constructor() {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
    }

    this.model = google('gemini-2.0-flash-exp');
  }

  getModel = (): LanguageModel => {
    return this.model;
  };

  getProviderName = (): string => {
    return 'Google AI (Gemini)';
  };
}
