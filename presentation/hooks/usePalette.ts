import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectPalette, setActivePalette } from '@/lib/redux/features/palette/paletteSlice';
import { PaletteItem } from '@/infrastructure/interfaces/palette-slice.interface';

export const usePalette = () => {
  const dispatch = useAppDispatch();
  const palette = useAppSelector(selectPalette);

  const savePaletteChanges = (paletteValues: PaletteItem) => {
    dispatch(setActivePalette({ ...paletteValues }));
  };

  return {
    // Props
    palette,

    // Methods
    savePaletteChanges
  };
};
