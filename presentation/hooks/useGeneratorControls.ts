import { useEffect, useMemo, useState } from 'react';
import { usePalette } from './usePalette';
import { PaletteState } from '@/infrastructure/interfaces/palette-state.interface';
import { ControlColorOptions } from '@/infrastructure/interfaces/palette-slice.interface';
import { applySliderAdjustments } from '@/utils/color-conversions/color-adjustments';

export const useGeneratorControls = () => {
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

  // Apply slider adjustments to generated colors in real-time
  const adjustedColors = useMemo(
    () =>
      paletteState.generatedColors.map((item) => ({
        ...item,
        color: applySliderAdjustments(
          item.color,
          paletteState.colorOptionControl.brightness,
          paletteState.colorOptionControl.saturation,
          paletteState.colorOptionControl.warmth
        ),
      })),
    [
      paletteState.generatedColors,
      paletteState.colorOptionControl.brightness,
      paletteState.colorOptionControl.saturation,
      paletteState.colorOptionControl.warmth,
    ]
  );

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
    adjustedColors,
    updateColorControl,
    updateState,
  };
};
