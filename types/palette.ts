export type HarmonyType =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'monochromatic'
  | 'split-complementary'
  | 'tetradic';

export const HARMONY_TYPES: { value: HarmonyType; label: string }[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'split-complementary', label: 'Split-Complementary' },
  { value: 'tetradic', label: 'Tetradic' },
];
