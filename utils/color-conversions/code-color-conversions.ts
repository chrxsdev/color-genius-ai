import Color from 'color';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';
import { Format } from '@/infrastructure/types/format.types';

/**
 * Converts a HEX color string to HSL (Hue, Saturation, Lightness) values
 * @param hex - Hex color string (e.g., "#FF5733" or "FF5733")
 * @returns Object containing hue (0-360), saturation (0-100), and lightness (0-100)
 */
export const hexToHSL = (hex: string): { hue: number; saturation: number; lightness: number } => {
  const color = Color(hex);
  const hsl = color.hsl().object();
  
  return {
    hue: hsl.h,
    saturation: hsl.s,
    lightness: hsl.l,
  };
};

/**
 * Converts HSL (Hue, Saturation, Lightness) values to a HEX color string
 * @param hue - Hue value (0-360 degrees)
 * @param saturation - Saturation percentage (0-100)
 * @param lightness - Lightness percentage (0-100)
 * @returns Hex color string (e.g., "#FF5733")
 */
export const hslToHex = (hue: number, saturation: number, lightness: number): string => {
  const color = Color.hsl(hue, saturation, lightness);
  return color.hex().toUpperCase();
};

/**
 * Converts a HEX color string to an RGB color string
 * @param hex - Hex color string (e.g., "#FF5733" or "FF5733")
 * @returns RGB color string (e.g., "rgb(255, 87, 51)")
 */
export const hexToRgb = (hex: string): string => {
  const color = Color(hex);
  return color.rgb().string();
};

/**
 * Getting the color value based on the selected format
 * @param color
 * @param format
 * @returns
 */
export const getColorValues = (colors: ColorItem, format: Format): { name: string; colorCode: string } => {
  const name = colors.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  const formatColor = format === 'HEX' ? colors.color.toLocaleUpperCase() : hexToRgb(colors.color);

  return {
    name,
    colorCode: formatColor,
  };
};
