import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaletteItem } from '@/infrastructure/interfaces/palette-slice.interface';

const initialState: PaletteItem = {
  colors: [],
  paletteName: '',
  colorFormat: 'HEX',
  rationale: '',
  tags: [],
  harmony: 'analogous',
  colorControl: {
    brightness: 50,
    saturation: 50,
    warmth: 50,
  },
};

export const paletteSlice = createSlice({
  name: 'palette',
  initialState: initialState,
  reducers: {
    setActivePalette: (state, action: PayloadAction<PaletteItem>) => {
      state.colors = action.payload.colors;
      state.paletteName = action.payload.paletteName;
      state.colorFormat = action.payload.colorFormat;
      state.rationale = action.payload.rationale;
      state.tags = action.payload.tags;
      state.harmony = action.payload.harmony;
      state.colorControl = { ...action.payload.colorControl };
    },
  },

  selectors: {
    selectPalette: (state: PaletteItem) => state,
  },
});

export const { setActivePalette } = paletteSlice.actions;
export const { selectPalette } = paletteSlice.selectors;

export const paletteReducer = paletteSlice.reducer;
