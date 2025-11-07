import { HeightPattern } from '@/infrastructure/types/filters.types';

// Map height patterns to Tailwind classes
export const heightClasses: Record<HeightPattern, string> = {
  medium: 'h-[20.5rem]',
  tall: 'h-[22rem]',
};
