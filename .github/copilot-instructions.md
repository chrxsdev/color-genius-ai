# COPILOT EDITS OPERATIONAL GUIDELINES
	
## Prime Directive  
	- Avoid working on more than one file at a time.
	- Multiple simultaneous edits to a file will cause corruption.
	- Be chatting and teach about what you are doing while coding.
	- Dont execute the project, just edit the code.
	- Always ask for confirmation before making large changes.

## Large File / Complex Change Handling

### Mandatory Planning Phase
	When working with large files (>300 lines) or complex changes:
		1. ALWAYS start by creating a detailed plan BEFORE making any edits
            2. Your plan MUST include:
                   - All functions/sections that need modification
                   - The order in which changes should be applied
                   - Dependencies between changes
                   - Estimated number of separate edits required
            3. Format your plan as:

## Proposed Edit Plan
	Working with: [filename]
	Total planned edits: [number]

### Making Edits
	- Focus on one conceptual change at a time
	- Include concise explanations of what changed and why
	- Always check if the edit maintains the project's coding style

### Edit sequence:
	1. [First specific change] - Purpose: [why]
	2. [Second specific change] - Purpose: [why]
            
### Execution and Follow-up
	- After each individual edit, clearly indicate progress:
		"✅ Completed edit [#] of [total]. Ready for next edit?"
	- If you discover additional needed changes during editing:
	- STOP and update the plan
	- Get approval before continuing
                
### Refactoring Guidance
	When refactoring large files:
	- Break work into logical, independently functional chunks
	- Ensure each intermediate state maintains functionality
	- Consider temporary duplication as a valid interim step
	- Always indicate the refactoring pattern being applied
                
### Rate Limit Avoidance
	- For very large files, suggest splitting changes across multiple sessions
	- Prioritize changes that are logically complete units
	- Always provide clear stopping points

# GENERAL PROJECT REQUIREMENTS
  - Prioritize clean, maintainable code with appropriate comments.
  
## Project Overview

--- AI Color Palette Generator ---
ColorGenius AI is a cutting-edge web application that leverages artificial intelligence to generate stunning color palettes. Users can input keywords or themes, and the AI will create harmonious color combinations that can be used for design projects, branding, and more. The application features a sleek, modern interface with responsive design, ensuring a seamless experience across all devices.

## File Structure & Organization Suggestions
The project follows a clear and organized folder structure to separate concerns and improve maintainability:
```
color-genius-ai/
├── app/            	# Application entry point and routing
├── api/             # API layer
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── [module]/     # Group related components
│   └── ui/          # Generic UI components (buttons, inputs, etc.)
├── config/           # Environment and configuration
├── constants/        # Static data and constants
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and external integrations
└── types/            # TypeScript type definitions
```

## Code Style & Conventions

### Component Structure
- Use **functional components** with TypeScript
- Follow **PascalCase** for component names
- Export components as **named exports** from files
- Use **explicit interfaces** for props with descriptive names

```tsx
interface AboutSectionProps {
  projectsCount: number;
  yearsExperience: string;
}

export const AboutSection = ({ projectsCount, yearsExperience }: AboutSectionProps) => {
  // Component logic
};
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `AboutSection.tsx`)
- Hooks: `camelCase.ts` starting with "use" (e.g., `useTheme.ts`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)
- Types: `camelCase.ts` or `index.ts` for barrel exports

## General Coding Conventions
- **Prefer single quotes** (`'`) over double quotes (`"`) in TypeScript files
- Use **2 spaces for indentation** (applies to all files)

### TypeScript Guidelines
- Use **strict TypeScript** configuration
- Use **arrow functions** for all components and functions and export them as default
- Define **explicit interfaces** for all props and complex objects
- Use **type-only imports** when importing types: `import type { ComponentType } from 'react'`
- Avoid `any` type - use proper typing or `unknown`

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
- Supports **light/dark mode** toggle
- **Gradient accents** for highlights
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

1. **Always use TypeScript interfaces** for component props
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
