import { ColorHarmonyType } from '@/infrastructure/interfaces/color-harmony.interface';

export const HARMONY_TYPES: ColorHarmonyType[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split_complementary', label: 'Split-Complementary' },
  { value: 'tetradic', label: 'Tetradic' },
];
