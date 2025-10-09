/**
 * Color conversion utilities for converting between HEX and HSL color formats
 */

/**
 * Converts a HEX color string to HSL (Hue, Saturation, Lightness) values
 * @param hex - Hex color string (e.g., "#FF5733" or "FF5733")
 * @returns Object containing hue (0-360), saturation (0-100), and lightness (0-100)
 */
export const hexToHSL = (hex: string): { hue: number; saturation: number; lightness: number } => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;

  if (delta !== 0) {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === r) {
      hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      hue = ((b - r) / delta + 2) / 6;
    } else {
      hue = ((r - g) / delta + 4) / 6;
    }
  }

  return {
    hue: hue * 360,
    saturation: saturation * 100,
    lightness: lightness * 100,
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
  const normalizedHue = ((hue % 360) + 360) % 360;
  const s = Math.max(0, Math.min(100, saturation)) / 100;
  const l = Math.max(0, Math.min(100, lightness)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (normalizedHue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (normalizedHue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (normalizedHue < 180) {
    [r, g, b] = [0, c, x];
  } else if (normalizedHue < 240) {
    [r, g, b] = [0, x, c];
  } else if (normalizedHue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  const toHex = (value: number): string => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
