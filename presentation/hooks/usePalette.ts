import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectPalette, setColorControl } from '@/lib/redux/features/palette/paletteSlice';
import { ControlColorType } from '@/infrastructure/types/format.types';

export const usePalette = () => {
  const dispatch = useAppDispatch();
  const palette = useAppSelector(selectPalette);

  const updateColorControl = (value: number, type: ControlColorType) => {
    dispatch(
      setColorControl({
        value,
        key: type as string,
      })
    );
  };

  return {
    // Props
    palette,

    // Methods
    updateColorControl,
  };
};
