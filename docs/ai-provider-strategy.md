# AI Provider Strategy Pattern

This module implements a Strategy Pattern for supporting multiple AI providers in the Color Genius AI application.

## Overview

The AI provider system allows you to seamlessly switch between different AI providers (Google, OpenAI) for color palette generation.

## Architecture

```
lib/ai/
├── index.ts                        # Main exports
├── palette-generator.ts            # Main palette generator class
├── ai-provider.factory.ts          # Factory for creating provider strategies
└── strategies/
    ├── google-ai.strategy.ts       # Google AI implementation
    ├── openai.strategy.ts          # OpenAI implementation
```

## Components

### 1. AiProvider Enum (`infrastructure/enums/ai-provider.enum.ts`)
Defines available AI providers:
- `Google` - Google's Gemini models
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
Each provider has its own strategy implementation:
- **GoogleAiStrategy** - Uses `gemini-2.0-flash-exp`
- **OpenAiStrategy** - Uses `gpt-5-mini` (requires `@ai-sdk/openai`)

### 4. Factory (`lib/ai/ai-provider.factory.ts`)
Creates the appropriate provider strategy based on the enum value.

## Usage

### Basic Usage (Default Provider)
```typescript
import { PaletteGenerator } from '@/lib/ai';

// Uses default provider from environment (AI_PROVIDER)
const generator = new PaletteGenerator();
const palette = await generator.generatePalette('sunset vibes', 'complementary');
```

### Explicit Provider Selection
```typescript
import { PaletteGenerator, AiProvider } from '@/lib/ai';

// Use Google AI explicitly
const googleGenerator = new PaletteGenerator(AiProvider.Google);

// Use OpenAI explicitly
const openaiGenerator = new PaletteGenerator(AiProvider.OpenAI);
```

### Dynamic Provider Selection
```typescript
import { PaletteGenerator, AiProvider } from '@/lib/ai';

const getGenerator = (provider: AiProvider) => {
  return new PaletteGenerator(provider);
};

const generator = getGenerator(AiProvider.OpenAI);
```

## Environment Variables

### Required for Each Provider

**Google AI (Default)**
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

**OpenAI** (requires installation: `pnpm add @ai-sdk/openai`)
```env
OPENAI_API_KEY=your_api_key_here
```

### Default Provider Selection
```env
# Set default provider (optional, defaults to 'google')
AI_PROVIDER=google  # or 'openai' or 'anthropic'
```

## Installation

### Core Package (Installed)
```bash
pnpm add ai @ai-sdk/google @ai-sdk/openai
```

## Adding a New Provider

To add a new AI provider:

1. **Update the enum** (`infrastructure/enums/ai-provider.enum.ts`):
```typescript
export enum AiProvider {
  Google = 'google',
  OpenAI = 'openai',
  NewProvider = 'newprovider', // Add here
}
```

2. **Create strategy class** (`lib/ai/strategies/newprovider.strategy.ts`):
```typescript
import type { LanguageModel } from 'ai';
import type { AiProviderStrategy } from '@/infrastructure/interfaces/ai-provider-strategy.interface';

export class NewProviderStrategy implements AiProviderStrategy {
  private readonly model: LanguageModel;

  constructor() {
    if (!process.env.NEWPROVIDER_API_KEY) {
      throw new Error('Missing NEWPROVIDER_API_KEY');
    }
    // Initialize your model here
  }

  getModel = (): LanguageModel => this.model;
  getProviderName = (): string => 'New Provider';
}
```

3. **Update factory** (`lib/ai/ai-provider.factory.ts`):
```typescript
case AiProvider.NewProvider:
  return new NewProviderStrategy();
```

4. **Export** (`lib/ai/index.ts`):
```typescript
export { NewProviderStrategy } from './strategies/newprovider.strategy';
```

## Benefits of This Pattern

1. **Flexibility** - Easy to switch between providers
2. **Extensibility** - Simple to add new providers
3. **Maintainability** - Each provider is isolated in its own class
4. **Testability** - Easy to mock providers for testing
5. **Type Safety** - Full TypeScript support throughout
6. **Configuration** - Environment-based default provider selection

## Notes

- Google AI is the default provider and comes pre-configured
- All providers share the same interface for consistent usage
- Provider selection can be done at runtime or via environment variables
- Each provider may have different rate limits and costs
