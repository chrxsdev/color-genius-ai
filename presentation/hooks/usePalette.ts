import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Palette, PaletteItem } from '@/infrastructure/interfaces/palette-slice.interface';
import { saveCurrentPalette } from '@/lib/redux/features/palette/paletteSlice';

export const usePalette = () => {
  const dispatch = useAppDispatch();
  const palette = useAppSelector((state) => state.palette);

  const setCurrentPalette = (paletteData: PaletteItem) => {
    dispatch(saveCurrentPalette(paletteData));
  };

  return {
    // Props
    palette,

    // Methods
    setCurrentPalette,
  };
};
