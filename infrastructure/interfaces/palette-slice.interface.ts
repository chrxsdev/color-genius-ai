import { Format } from '../types/format.types';
import { HarmonyType } from '../types/harmony-types.type';
import { ColorItem } from './color-harmony.interface';

export interface ColorControl {
  brightness: number;
  saturation: number;
  warmth: number;
}

export interface PaletteItem {
  colors: ColorItem[];
  paletteName: string;
  colorFormat: Format;
  rationale: string;
  tags: string[];
  harmony: HarmonyType;
  colorControl: ColorControl;
}

export interface ControlColorPayload {
  value: number;
  key: string;
}
