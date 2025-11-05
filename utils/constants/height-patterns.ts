import { HeightPattern } from '@/infrastructure/types/filters.types';

// Map height patterns to Tailwind classes
export const heightClasses: Record<HeightPattern, string> = {
  short: 'h-48',
  medium: 'h-64',
  tall: 'h-80',
  extra_tall: 'h-96',
};
