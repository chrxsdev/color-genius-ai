import { HeightPattern } from '@/infrastructure/types/filters.types';

// Map height patterns to Tailwind classes
export const heightClasses: Record<HeightPattern, string> = {
  medium: 'h-[20rem]',
  tall: 'h-[21rem]',
};
