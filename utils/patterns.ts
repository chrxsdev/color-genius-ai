import { HeightPattern } from '@/infrastructure/types/height-patterns.types';

export const getHeightPattern = (index: number): HeightPattern => {
  const patterns: HeightPattern[] = ['short', 'tall', 'medium', 'extra_tall'];
  return patterns[index % patterns.length];
};
