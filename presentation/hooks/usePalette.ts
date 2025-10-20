import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectPalette } from '@/lib/redux/features/palette/paletteSlice';

export const usePalette = () => {
  const dispatch = useAppDispatch();
  const palette = useAppSelector(selectPalette);


  return {
    // Props
    palette,

    // Methods
  
  };
};
