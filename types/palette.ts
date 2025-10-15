export type HarmonyType =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'monochromatic'
  | 'split_complementary'
  | 'tetradic';

export type Format = 'HEX' | 'RGB';
export interface ColorHarmonyType {
  value: HarmonyType;
  label: string;
}

export const HARMONY_TYPES: ColorHarmonyType[] = [
  { value: 'analogous', label: 'Analogous' },
  { value: 'monochromatic', label: 'Monochromatic' },
  { value: 'complementary', label: 'Complementary' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split_complementary', label: 'Split-Complementary' },
  { value: 'tetradic', label: 'Tetradic' },
];

export interface ColorItem {
  color: string;
  name: string;
}
