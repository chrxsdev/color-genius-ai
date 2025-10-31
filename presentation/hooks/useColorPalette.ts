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
    saturation: 0,
    warmth: 0,
  },
};

export const useColorPalette = () => {
  const [paletteState, setPaletteState] = useState<PaletteState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);


  useEffect(() => {
    const rawUserPalette = localStorage.getItem('user_palette');
    
    if (!rawUserPalette) {
      setIsHydrated(true);
      return;
    }
    
    const parsed = JSON.parse(rawUserPalette) as PaletteState;
    setPaletteState((prev) => ({
      ...prev,
      ...parsed,
    }));
    setIsHydrated(true);
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
    adjustedColors,
    updateColorControl,
    updateState,
    setIsHydrated
  };
};
