import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { PaletteItem } from '@/infrastructure/interfaces/palette-slice.interface';
import { saveCurrentPalette, selectPalette } from '@/lib/redux/features/palette/paletteSlice';

export const usePalette = () => {
  const dispatch = useAppDispatch();
  const currentPalette = useAppSelector(selectPalette);

  const setCurrentPalette = (paletteData: PaletteItem) => {
    dispatch(saveCurrentPalette(paletteData));
  };


  return {
    // Props
    currentPalette,

    // Methods
    setCurrentPalette,
  };
};
