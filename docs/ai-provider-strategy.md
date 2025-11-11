# AI Provider Strategy Pattern

This module implements a Strategy Pattern for supporting multiple AI providers in the Color Genius AI application.

## Overview

The AI provider system allows you to seamlessly switch between Google Gemini and OpenAI for color palette generation, or easily add custom providers using the strategy pattern.

## Architecture

```
lib/ai/
├── index.ts                        # Main exports
├── palette-generator.ts            # Main palette generator class
├── ai-provider.factory.ts          # Factory for creating provider strategies
└── strategies/
    ├── google-ai.strategy.ts       # Google Gemini implementation (default)
    └── openai.strategy.ts          # OpenAI implementation
```

## Components

### 1. AiProvider Enum (`infrastructure/enums/ai-provider.enum.ts`)
Defines available AI providers (extensible):
- `Google` - Google's Gemini models (default)
- `OpenAI` - OpenAI's GPT models

### 2. AiProviderStrategy Interface (`infrastructure/interfaces/ai-provider-strategy.interface.ts`)
Contract that all provider strategies must implement:
```typescript
interface AiProviderStrategy {
  getModel: () => LanguageModel;
  getProviderName: () => string;
}
```

### 3. Concrete Strategies (`lib/ai/strategies/`)
Current implementations:
- **GoogleAiStrategy** - Uses `gemini-2.0-flash-exp` (included by default)
- **OpenAiStrategy** - Uses `gpt-4o` (requires `pnpm add @ai-sdk/openai`)

### 4. Factory (`lib/ai/ai-provider.factory.ts`)
Creates the appropriate provider strategy based on the enum value.

## Adding a New AI Provider
### Default Provider Selection
```env
# Set default provider (optional, defaults to 'google')
AI_PROVIDER=google  # Options: 'google' or 'openai'
```

1. **Add provider to enum** (`infrastructure/enums/ai-provider.enum.ts`):
```typescript
export enum AiProvider {
  Google = 'google',
  OpenAI = 'openai',
  YourProvider = 'yourprovider',  // Add your provider
}
```

2. **Install the provider SDK** (if not already included):
```bash
# Example for Anthropic
pnpm add @ai-sdk/anthropic

# Example for Cohere
pnpm add @ai-sdk/cohere
```

3. **Create strategy class** (`lib/ai/strategies/yourprovider.strategy.ts`):
```typescript
import type { LanguageModel } from 'ai';
import type { AiProviderStrategy } from '@/infrastructure/interfaces/ai-provider-strategy.interface';

export class YourProviderStrategy implements AiProviderStrategy {
  private readonly model: LanguageModel;

  constructor() {
    if (!process.env.YOUR_PROVIDER_API_KEY) {
      throw new Error('Missing YOUR_PROVIDER_API_KEY environment variable');
    }

    // Example for Anthropic:
    // const { anthropic } = require('@ai-sdk/anthropic');
    // this.model = anthropic('claude-3-5-sonnet-20241022');

    // Example for Cohere:
    // const { cohere } = require('@ai-sdk/cohere');
    // this.model = cohere('command-r-plus');
  }

  getModel = (): LanguageModel => this.model;
  getProviderName = (): string => 'Your Provider Name';
}
```

4. **Update factory** (`lib/ai/ai-provider.factory.ts`):

Add the import at the top:
```typescript
import { YourProviderStrategy } from './strategies/yourprovider.strategy';
```

Update the `getAiProviderStrategy` function:
```typescript
export const getAiProviderStrategy = (provider: AiProvider): AiProviderStrategy => {
  switch (provider) {
    case AiProvider.Google:
      return new GoogleAiStrategy();
    case AiProvider.OpenAI:
      return new OpenAiStrategy();
    case AiProvider.YourProvider:  // Add your case
      return new YourProviderStrategy();
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
};
```

Update the `getDefaultAiProvider` function:
```typescript
export const getDefaultAiProvider = (): AiProvider => {
  const envProvider = process.env.AI_PROVIDER?.toLowerCase();
  switch (envProvider) {
    case AiProvider.OpenAI:
      return AiProvider.OpenAI;
    case 'yourprovider':  // Add your case
      return AiProvider.YourProvider;
    case AiProvider.OpenAI:
    default:
      return AiProvider.Google;
  }
};
```

5. **Export from index** (`lib/ai/index.ts`):
```typescript
export { YourProviderStrategy } from './strategies/yourprovider.strategy';
```

6. **Set environment variables**:
```bash
AI_PROVIDER=yourprovider
YOUR_PROVIDER_API_KEY=your_api_key
```

7. **Test your implementation**:
```typescript
import { PaletteGenerator, AiProvider } from '@/lib/ai';

const generator = new PaletteGenerator(AiProvider.YourProvider);
const palette = await generator.generatePalette('sunset colors', 'complementary');
```

## Benefits of This Pattern

1. **Flexibility** - Easy to switch between providers
2. **Extensibility** - Simple to add new providers
3. **Maintainability** - Each provider is isolated in its own class
4. **Testability** - Easy to mock providers for testing
5. **Type Safety** - Full TypeScript support throughout
6. **Configuration** - Environment-based default provider selection

## Notes

- **Google Gemini and OpenAI** comes pre-configured
- **Other models** requires additional package installation: `pnpm add @ai-sdk/<provider>`
- All providers share the same interface for consistent usage
- Provider selection can be done at runtime or via environment variables
- Each provider may have different rate limits, costs, and response characteristics
- The system automatically falls back to Google if the specified provider is unavailable
