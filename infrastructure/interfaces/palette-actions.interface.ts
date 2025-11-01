import { Format } from '../types/format.types';
import { HarmonyType } from '../types/harmony-types.types';
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

export interface PaletteResponse {
  id: string;
  palette_name: string;
  colors: ColorItem[];
  color_format: Format;
  rationale: string | null;
  tags: string[];
  harmony_type: HarmonyType;
  color_control: ColorControl;
  user_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ExplorePaletteResponse extends PaletteResponse {
  profile: ProfileInfo | null;
  likes_count: number;
}

export interface ProfileInfo {
  id?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}
