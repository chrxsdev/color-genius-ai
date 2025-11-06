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

- **AI-driven palette generation** – Generate 6 colors from natural language prompts using AI models (Google Gemini 2.0 Flash)
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
│   ├── enums/                  # Code style and format enums
│   ├── interfaces/             # TypeScript interfaces for core data structures
│   ├── schemas/                # Zod validation schemas for API and data
│   └── types/                  # Type definitions for filters, formats, and harmonies
├── lib/                        # Core libraries and utilities
│   ├── ai/                     # AI palette generator using Gemini API
│   │   └── palette-generator.ts
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
- **AI/ML:** Google Gemini 2.0 Flash via AI SDK
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
- Google Gemini API key
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

# Required: Google Gemini API Key for AI palette generation
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Required: Supabase project credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_DB_SCHEMA=public
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
pnpm build
pnpm start
```

## Usage

### Generating a Palette

1. Navigate to the dashboard at `/dashboard`
2. Enter a natural language description (e.g., "ocean sunset with warm tones")
3. Select a color harmony type (analogous, complementary, triadic, etc.)
4. Choose the number of colors (3-8, default is 5)
5. Click "Generate" to create your palette

### API Example

```bash
# Generate a palette via API
curl -X POST http://localhost:3000/api/generate-palette \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "modern tech dashboard with blues",
    "harmony": "analogous",
    "colorCount": 5
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
    "generatedAt": "2025-11-05T...",
    "model": "gemini-2.0-flash-exp",
    "provider": "google"
  }
}
```

## Configuration

### Environment Variables

- `URI` – Application base URL for OAuth callbacks and redirects
- `GOOGLE_GENERATIVE_AI_API_KEY` – **Required** API key for Google Gemini AI model
- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` – Supabase anonymous/public key
- `SUPABASE_DB_SCHEMA` – Database schema name (default: `public`)

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
