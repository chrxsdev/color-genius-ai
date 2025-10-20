import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ControlColorPayload, PaletteItem } from '@/infrastructure/interfaces/palette-slice.interface';

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
    setColorControl: (state, action: PayloadAction<ControlColorPayload>) => {
      state.colorControl = {
        ...state.colorControl,
        [action.payload.key]: action.payload.value,
      };
    },
  },

  selectors: {
    selectPalette: (state: PaletteItem) => state,
  },
});

export const { setColorControl } = paletteSlice.actions;
export const { selectPalette } = paletteSlice.selectors;

export const paletteReducer = paletteSlice.reducer;
