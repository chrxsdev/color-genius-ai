---
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx'
---

# PROJECT CODING STANDARDS & BEST PRACTICES

- Prioritize clean, maintainable code with appropriate comments.

## Project Structure & Organization Suggestions

The project follows a clear and organized folder structure to separate concerns and improve maintainability. Below is an updated diagram that reflects this repository's actual layout with a one-line description for each top-level folder/module.

```
color-genius-ai/
├── app/                  # Next.js app directory containing pages, layouts, and API routes
│   ├── api/              # Serverless API endpoints for palette generation and auth
│   ├── (app)/            # App Options related to users pages 
        └── dashboard/    # User dashboard and palette management interface
│   ├── (site)/           # Public Options related to users pages
        └── auth/         # Authentication-related pages
├── actions/              # Actions and action creators
├── lib/                  # Core business logic and service integrations
│   ├── ai/               # AI service integration and palette generation logic
│   ├── redux/            # Redux state management and actions
│   └── supabase/         # Supabase client & server configuration and database actions
├── docs/                 # Technical documentation and implementation guides
├── infrastructure/      # Infrastructure configuration and deployment scripts
│   ├── schemas/         # Zod schemas for runtime type validation
│   ├── interfaces/      # TypeScript interfaces for type-safe API contracts
│   ├── types/           # TypeScript type definitions
│   └── enums/           # TypeScript enums for type-safe constants
├── presentation/        # UI components and layout elements
│   └── components/      # Reusable React components organized by feature
├── public/              # Static assets and public resources
├── utils/               # Utility functions and helper modules
│   ├── code-generators/ # Code generation utilities for color styles
│   ├── color-conversions/ # Color manipulation and conversion functions
│   ├── constants/       # Global constants and configuration values
│   └── prompts/         # AI prompt templates and generators
├── .env                 # Environment variables template
├── .github/             # GitHub workflows and repository configuration
├── middleware.ts        # Next.js middleware for request handling
├── next.config.ts       # Next.js configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.mjs   # PostCSS configuration for styling
├── tsconfig.json        # TypeScript compiler configuration
└── eslint.config.mjs    # ESLint configuration for code style
```

Any deviations from this structure, please suggest improvements or apply changes to align with these guidelines.

## Code Style & Conventions

### Next.js Code Structure

- Use **functional components** with TypeScript
- Export components as **named exports** from files
- Export pages as **default exports**
- Use **`use client` directive** for client components
- Use **`use server` directive** for server components
- Use **explicit interfaces** for props with descriptive names
- Get all props as a single object and destructure them in the function signature
- Avoid React.FC/FC, type props in the function signature directly
- Interfaces for props should be in the same file, the rest in separate files

```tsx
interface SomeSectionProps {
  projectsCount: number;
  yearsExperience: string;
}

export const SomeSection = ({ projectsCount, yearsExperience }: SomeSectionProps) => {
  // Component logic
};
```

### Code Style Guidelines

- Use **strict TypeScript** configuration
- Follow **PascalCase** for component, function, variable, and type names
- Use **arrow functions** for all components, layout, pages, utility files and all the functions (lib, utils, functions in components or hooks) and export them as default
- Use **optional chaining** and **nullish coalescing** for safe property access
- Define **explicit interfaces** for all props and complex objects
- Use **type-only imports** when importing types: `import type { ComponentType } from 'react'`
- Avoid `any` type - use proper typing or `unknown`
- **Use always single quotes** (`'`) over double quotes (`"`) in JS/TS, JSX/TSX, HTML, CSS files
- Use **2 spaces for indentation** (applies to all files)
- Use **`async/await`** for asynchronous operations
- Use Async/Await syntax for all async operations
- Catch and handle errors with logging
- User ?? instead of || when rendering default values
- Avoid declaring multiple components in the same file; if creating a new component is necessary, always place it in a separate file.

### Styling Conventions

- Implement **custom CSS variables** for theme colors
- Use the `cn()` utility function for conditional classes: `cn(clsx, twMerge)`
- Follow **mobile-first** responsive design approach

### State Management

- Use **React hooks** for local state (`useState`, `useEffect`)
- Implement **custom hooks** for reusable logic
- Follow **proper hook dependencies** in useEffect arrays

### Component Patterns

- Use **compound components** for complex UI elements
- Implement **proper loading states** and error boundaries
- Use **React.memo** for performance optimization when needed
- Handle **async operations** with proper error handling

### Animation Guidelines

- Use **CSS transitions** for simple hover effects with tailwind when possible
- Use **GSAP** for complex animations

### API Integration

- Use **Supabase client** for backend operations
- Implement **proper error handling** for API calls
- Use **TypeScript types** for API responses
- Handle **loading states** appropriately

## Design System

### Color Palette

- Uses **custom CSS variables** for theming
- **Muted colors** for secondary text

### Typography

- **Responsive font sizes** using Tailwind classes
- **Gradient text** for headings and accents
- **Proper line heights** for readability

### Layout

- **Mobile-first** responsive design
- **Grid/Flexbox** layouts for complex structures
- **Consistent spacing** using Tailwind spacing scale
- **Maximum width containers** for content centering

## Common Patterns to Follow

1. **Always use TypeScript interfaces** for component props, parameters (if params are more than 3), and return types
2. **Export components as named exports** (not default)
3. **Use the `cn()` utility** for className combinations
4. **Implement proper loading and error states**
5. **Follow the established folder structure**
6. **Use custom hooks** for reusable logic
7. **Maintain responsive design** principles
8. **Keep animations performant** and accessible

## Code Quality Standards

- **ESLint configuration** is enforced
- **Consistent formatting** across the codebase
- **Meaningful variable and function names**
- **Proper TypeScript typing** for all functions and components
- **Comment complex logic** and business rules
- **Keep components focused** and single-purpose
