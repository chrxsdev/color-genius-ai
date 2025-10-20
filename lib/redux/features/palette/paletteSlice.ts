import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';

interface Palette {
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

const initialState: Palette = {
  colors: [],
  paletteName: '',
  colorFormat: '',
  rationale: '',
  tags: [],
  harmony: '',
  brightness: 50,
  saturation: 50,
  warmth: 50,
};

export const paletteSlice = createSlice({
  name: 'palette',
  initialState,
  reducers: {},
});

export const {} = paletteSlice.actions;
export const paletteReducer = paletteSlice.reducer;
