import type { LanguageModel } from 'ai';

/**
 * Interface for AI provider strategy
 * Each provider must implement this interface to provide a language model
 */
export interface AiProviderStrategy {
  /**
   * Get the language model instance for this provider
   */
  getModel: () => LanguageModel;

  /**
   * Get the provider name
   */
  getProviderName: () => string;
}
