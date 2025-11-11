import { AiProvider } from '@/infrastructure/enums/ai-provider.enum';
import type { AiProviderStrategy } from '@/infrastructure/interfaces/ai-provider-strategy.interface';
import { GoogleAiStrategy } from './strategies/google-ai.strategy';
import { OpenAiStrategy } from './strategies/openai.strategy';

/**
 * Factory function to get AI provider strategy based on provider type
 * Implements the Strategy pattern for AI provider selection
 * 
 * @param provider - The AI provider enum value
 * @returns The appropriate AI provider strategy instance
 * @throws Error if provider is not supported
 */
export const getAiProviderStrategy = (provider: AiProvider): AiProviderStrategy => {
  switch (provider) {
    case AiProvider.Google:
      return new GoogleAiStrategy();    
    case AiProvider.OpenAI:
      return new OpenAiStrategy();
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};

/**
 * Get the default AI provider from environment variables
 * Falls back to Google if not specified
 */
export const getDefaultAiProvider = (): AiProvider => {
  const envProvider = process.env.AI_PROVIDER?.toLowerCase();
  
  switch (envProvider) {
    case 'openai':
      return AiProvider.OpenAI;
    case 'google':
    default:
      return AiProvider.Google;
  }
};
