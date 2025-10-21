'use client';

import { useEffect, useMemo, useState } from 'react';
import { PaletteState } from '@/infrastructure/interfaces/palette-state.interface';
import { ControlColorOptions } from '@/infrastructure/interfaces/palette-slice.interface';
import { applySliderAdjustments } from '@/utils/color-conversions/color-adjustments';

const DEFAULT_STATE: PaletteState = {
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
};

export const useColorPalette = () => {
  const [paletteState, setPaletteState] = useState<PaletteState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
    const rawUserPalette = localStorage.getItem('user_palette');
    if (rawUserPalette) {
      const parsed = JSON.parse(rawUserPalette) as PaletteState;
      setPaletteState((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  }, []);

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
    isHydrated,
    isLoading,
    adjustedColors,
    updateColorControl,
    updateState,
  };
};
