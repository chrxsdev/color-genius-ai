import { HeightPattern } from '@/infrastructure/types/filters.types';

export const getHeightPattern = (index: number): HeightPattern => {
  return index % 2 === 0 ? 'tall' : 'medium';
};
