# Color Genius AI

**AI-powered color palette generation from natural language**

<img src="./public/logo.png" alt="Color Genius AI Logo" width="200"/>

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## Description

Color Genius AI is an intelligent color palette generator that transforms natural language descriptions into production-ready color schemes. Instead of manually picking colors or tweaking values, designers and developers can describe their vision—like "sunset gradient with moody purples" or "modern tech dashboard"—and receive a scientifically-validated palette complete with names, rationale, and export-ready code snippets.

The application leverages AI to understand design intent while applying color theory guardrails to ensure harmonious, accessible, and web-ready results. Each palette includes harmony conformity checks (analogous, complementary, triadic, etc.), perceptual color controls using OKLCH for natural adjustments, and instant export options for Tailwind CSS, CSS variables, and more.

Built for modern workflows, Color Genius AI bridges the gap between creative vision and technical implementation, enabling teams to maintain consistent design systems while exploring new color combinations with confidence.

## Features

- **AI-driven palette generation** – Generate colors from natural language prompts using AI models (Google Gemini or OpenAI)
- **Multiple AI provider support** – Switch between Google Gemini and OpenAI, or easily add custom providers
- **Color harmony validation** – Automatic conformity checks for analogous, complementary, triadic, monochromatic, split-complementary, and tetradic schemes
- **Perceptual color controls** – Adjust brightness, saturation, and warmth using OKLCH color space for natural-feeling modifications
- **Interactive visualizations** – View colors on a color wheel, preview gradients, and see swatches with accessibility badges
- **Export to multiple formats** – Copy-to-clipboard support for Tailwind config, CSS variables, and gradient utilities
- **Palette management** – Save palettes to your account and optionally share them in the explore section
- **Authentication & persistence** – Secure user accounts with Supabase and optional palette storage with Row Level Security
- **Accessibility focused** – WCAG-compliant contrast checks against light and dark backgrounds

## Project Structure

```
color-genius-ai/
├── actions/                    # Server actions for auth, palettes, and profiles
│   ├── auth.actions.ts
│   ├── palette.actions.ts
│   └── profile.actions.ts
├── app/                        # Next.js App Router pages and layouts
│   ├── (app)/                  # Protected app routes
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── likes/              # User's liked palettes
│   │   └── profile/            # User profile management
│   ├── (site)/                 # Public routes
│   │   ├── auth/               # Authentication pages
│   │   ├── explore/            # Browse community palettes
│   │   └── page.tsx            # Landing page
│   ├── api/                    # API routes
│   │   ├── auth/               # Auth callbacks
│   │   ├── generate-palette/   # AI palette generation endpoint
│   │   └── regenerate-name/    # Color name regeneration
│   ├── globals.css
│   └── layout.tsx
├── docs/                       # Technical documentation and design specs
│   ├── agent/
│   ├── authentication/
│   ├── color-wheel/
│   ├── design-doc/
│   └── palette-rules/
├── infrastructure/             # Type definitions, schemas, and enums
│   ├── enums/                  # Code style, format, and AI provider enums
│   │   ├── ai-provider.enum.ts # AI provider enum (Google, OpenAI)
│   │   └── code-style-format.enum.ts
│   ├── interfaces/             # TypeScript interfaces for core data structures
│   │   ├── ai-provider-strategy.interface.ts # AI provider strategy interface
│   │   └── ...
│   ├── schemas/                # Zod validation schemas for API and data
│   └── types/                  # Type definitions for filters, formats, and harmonies
├── lib/                        # Core libraries and utilities
│   ├── ai/                     # AI palette generator with multi-provider support
│   │   ├── strategies/         # AI provider strategy implementations
│   │   │   ├── google-ai.strategy.ts   # Google Gemini provider
│   │   │   └── openai.strategy.ts      # OpenAI provider
│   │   ├── ai-provider.factory.ts      # Factory for provider selection
│   │   ├── palette-generator.ts        # Main palette generator
│   │   └── index.ts            # Barrel exports
│   ├── redux/                  # Redux store, hooks, and RTK Query API
│   │   ├── api/
│   │   ├── hooks.ts
│   │   ├── provider.tsx
│   │   └── store.ts
│   └── supabase/               # Supabase client configuration
│       ├── middleware.ts
│       └── server.ts
├── presentation/               # React components organized by feature
│   ├── components/             # UI components
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── likes/
│   │   ├── navbar/
│   │   ├── palette/
│   │   ├── profile/
│   │   ├── sidebar/
│   │   └── ui/                 # Reusable UI primitives
│   └── hooks/                  # Custom React hooks for color palette logic
├── public/                     # Static assets (logo, images)
│   └── logo.png
├── utils/                      # Utility functions and constants
│   ├── code-generators/        # Code snippet generators for various formats
│   ├── color-conversions/      # Color space conversion utilities (HSL, RGB, HEX)
│   ├── constants/              # App-wide constants and configuration
│   └── prompts/                # AI prompt templates
├── components.json             # shadcn/ui configuration
├── middleware.ts               # Next.js middleware for auth
├── next.config.ts              # Next.js configuration
├── package.json
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js 15.5.4 with App Router
- **Runtime:** Node.js 20+
- **UI Library:** React 19.1.0
- **State Management:** Redux Toolkit with RTK Query
- **Styling:** Tailwind CSS 4, Framer Motion for animations
- **AI/ML:** Google Gemini (default) or OpenAI via Vercel AI SDK with strategy pattern
- **Database:** Supabase (PostgreSQL 15) with Row Level Security
- **Authentication:** Supabase SSR
- **Validation:** Zod schemas
- **Deployment:** Vercel
- **Package Manager:** pnpm
- **Additional Libraries:** 
  - Color manipulation: `color`, `lodash`
  - UI Components: Radix UI primitives
  - Code display: `react-syntax-highlighter`
  - Export: `html-to-image`

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm (recommended) or npm
- AI Provider API key (Google Gemini or OpenAI)
- Supabase project (for authentication and persistence)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chrxsdev/color-genius-ai.git
cd color-genius-ai
```

2. Install dependencies:
```bash
pnpm install
```

### Configuration

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Configure the following environment variables in `.env`:

```bash
# Project URL (for callbacks and redirects)
URI=http://localhost:3000

# AI Provider Selection (optional, defaults to 'google')
AI_PROVIDER=google  # Options: 'google' or 'openai'

# Google Gemini API Key (required if using Google)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (required if using OpenAI)
OPENAI_API_KEY=your_openai_api_key_here

# Required: Supabase project credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_DB_SCHEMA=public
```

### Run Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
pnpm build
pnpm start
```

## Usage

### Generating a Palette

1. Navigate to the dashboard at `/`
2. Enter a natural language description (e.g., "ocean sunset with warm tones")
3. Select a color harmony type (analogous, complementary, triadic, etc.)
4. Click "Generate" to create your palette
5. View the generated colors, rationale, and export options
6. Modify (if desired) and Save the palette to your profile or share it in the explore section

### API Example

```bash
# Generate a palette via API
curl -X POST http://localhost:3000/api/generate-palette \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "modern tech dashboard with blues",
    "harmony": "analogous",
    "colorCount": 6
  }'
```

Response:
```json
{
  "id": "b3f1c9f0-...",
  "colors": [
    { "color": "#667EEA", "name": "Purple Dawn" },
    { "color": "#764BA2", "name": "Deep Violet" }
  ],
  "metadata": {
    "prompt": "modern tech dashboard with blues",
    "harmony": "analogous",
    "rationale": "A professional palette...",
    "tags": ["tech", "modern", "blue"],
    "generatedAt": "2025-11-05T..."
  }
}
```

## Configuration

### Environment Variables

**Core Configuration:**
- `URI` – Application base URL for OAuth callbacks and redirects
- `AI_PROVIDER` – AI provider to use: `google` (default) or `openai`

**AI Provider Keys (configure based on your AI_PROVIDER selection):**
- `GOOGLE_GENERATIVE_AI_API_KEY` – API key for Google Gemini (required if `AI_PROVIDER=google`)
- `OPENAI_API_KEY` – API key for OpenAI (required if `AI_PROVIDER=openai`)

**Database:**
- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` – Supabase anonymous/public key
- `SUPABASE_DB_SCHEMA` – Database schema name (default: `public`)

> **Note:** Both Google Gemini (`@ai-sdk/google`) and OpenAI (`@ai-sdk/openai`) SDKs are already included when you run `pnpm install`. No additional installation is required to use either provider.

### Switching Between AI Providers

The application supports two AI providers out of the box:

**Google Gemini (Default):**
```bash
AI_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

**OpenAI:**
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
```

Simply set the `AI_PROVIDER` environment variable and provide the corresponding API key. The system will automatically use the selected provider.

### Adding a Custom AI Provider

The application uses a **Strategy Pattern** for AI provider support. Both Google Gemini and OpenAI are already implemented and installed. To add a new provider (e.g., Anthropic, Cohere, etc.) see the developer guide: [AI provider strategy docs](docs/ai-provider-strategy.md) for full step-by-step instructions, example strategy implementations, and factory updates.


### Configuration Files

- `next.config.ts` – Next.js configuration
- `tailwind.config.ts` – Tailwind CSS customization
- `eslint.config.mjs` – ESLint rules and code style
- `tsconfig.json` – TypeScript compiler options

## Testing

Testing infrastructure is planned for future releases. Current development relies on:
- Manual testing through the UI
- API endpoint validation
- Type safety via TypeScript

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The application is production-ready with:
- Server-side rendering for optimal performance
- Edge middleware for authentication
- Automatic code splitting and optimization

## Roadmap

### Planned Features
- **Image-based palette extraction** – Upload photos and generate palettes from images
- **Advanced palette editing** – Fine-tune individual colors with sliders and pickers
- **Palette duplication** – Make copies of community palettes for customization
- **Shareable links** – Generate unique URLs to share palettes with teams
- **Social authentication** – GitHub OAuth and magic link sign-in
- **Collaboration features** – Comments, version history, and team workspaces
- **Advanced export formats** – SCSS, Figma tokens, and more framework integrations

### Known Limitations
- AI generation requires active internet connection
- Rate limiting applies to API endpoints
- Some color harmonies may produce similar results for certain prompts
- Export formats are limited to CSS and Tailwind CSS

## License

MIT License. See [LICENSE](./LICENSE) for full details.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following the code style guidelines
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [code-style.instructions.md](.github/instructions/code-style.instructions.md) and [operational-guidelines.instructions.md](.github/instructions/operational-guidelines.instructions.md) for detailed contribution guidelines.

---

Built with ❤️ by [chrxsdev](https://github.com/chrxsdev)
