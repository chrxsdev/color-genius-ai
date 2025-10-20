import { ColorItem } from './color-harmony.interface';

export interface PaletteItem {
  colors: ColorItem[];
  paletteName: string;
  colorFormat: string;
  rationale: string;
  tags: string[];
  harmony: string;
  brightness: number;
  saturation: number;
  warmth: number;
}

export interface Palette {
  currentPalette: PaletteItem | null;
}