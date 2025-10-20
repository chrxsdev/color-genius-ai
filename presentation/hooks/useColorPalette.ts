import { useEffect, useState } from 'react';
import { usePalette } from './usePalette';
import { PaletteState } from '@/infrastructure/interfaces/palette-state.interface';
import { ControlColorOptions } from '@/infrastructure/interfaces/palette-slice.interface';

export const useColorPalette = () => {
  const { palette } = usePalette();
  const [paletteState, setPaletteState] = useState<PaletteState>({
    generatedColors: [],
    paletteName: '',
    colorFormat: 'HEX',
    rationale: null,
    tags: [],
    harmony: 'analogous',
    colorOptionControl: {
      brightness: 50,
      saturation: 50,
      warmth: 50,
    },
  });

  useEffect(() => {
    if (!palette || palette.colors.length === 0) return;

    setPaletteState({
      generatedColors: palette.colors,
      paletteName: palette.paletteName,
      colorFormat: palette.colorFormat,
      rationale: palette.rationale,
      tags: palette.tags,
      harmony: palette.harmony,
      colorOptionControl: {
        brightness: palette.colorControl.brightness,
        saturation: palette.colorControl.saturation,
        warmth: palette.colorControl.warmth,
      },
    });
  }, [palette]);

  const updateColorControl = (controls: ControlColorOptions) => {
    setPaletteState((prev) => ({
      ...prev,
      colorOptionControl: {
        ...prev.colorOptionControl,
        [controls.key]: controls.value,
      },
    }));
  };

  const updateState = (updates: Partial<PaletteState>) => {
    setPaletteState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return {
    ...paletteState,
    updateColorControl,
    updateState,
  };
};
