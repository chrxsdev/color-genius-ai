import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getResponsiveColumnCount(width: number): number {
  if (width < 640) {
    return 1;
  }

  if (width < 1024) {
    return 2;
  }

  return 4;
}
