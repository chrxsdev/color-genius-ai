import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';
import { Format } from '@/infrastructure/types/format.types';
import { HarmonyType } from '@/infrastructure/types/harmony-types.type';
import { ColorControl } from '@/infrastructure/interfaces/palette-slice.interface';

export interface PaletteState {
  generatedColors: ColorItem[];
  paletteName: string;
  colorFormat: Format;
  rationale: string | null;
  tags: string[];
  harmony: HarmonyType;
  colorOptionControl: ColorControl;
}