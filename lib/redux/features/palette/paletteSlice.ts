import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Palette, PaletteItem } from '@/infrastructure/interfaces/palette-slice.interface';

const initialState: Palette = {
  currentPalette: null,
};

export const paletteSlice = createSlice({
  name: 'palette',
  initialState: initialState,
  reducers: {
    saveCurrentPalette: (state, action: PayloadAction<PaletteItem>) => {
      state.currentPalette = {
        ...action.payload,
      };
    },
  },
});

export const { saveCurrentPalette } = paletteSlice.actions;
export const paletteReducer = paletteSlice.reducer;
