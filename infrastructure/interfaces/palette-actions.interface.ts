import { Format } from '../types/format.types';
import { HarmonyType } from '../types/harmony-types.type';
import { ColorItem } from './color-harmony.interface';
import { ColorControl } from './palette-slice.interface';

export interface PaletteRequest {
  palette_name: string;
  colors: ColorItem[];
  color_format: Format;
  rationale: string | null;
  tags: string[];
  harmony_type: HarmonyType;
  color_control: ColorControl;
  user_id: string;
}
