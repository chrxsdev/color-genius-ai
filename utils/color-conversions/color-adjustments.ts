import Color from 'color';

/**
 * Apply brightness, saturation, and warmth adjustments to a hex color
 *
 * This function takes a base color and applies three perceptual adjustments:
 * - Brightness: Adjusts the lightness in HSL space
 * - Saturation: Adjusts the color vibrancy
 * - Warmth: Shifts hue towards warm (red/yellow) or cool (blue/cyan) tones
 *
 * @param hexColor - Base hex color from AI generation (e.g., "#FF5733")
 * @param brightness - Brightness level 0-100 (50 = neutral, <50 darker, >50 brighter)
 * @param saturation - Saturation level 0-100 (50 = neutral, <50 less vibrant, >50 more vibrant)
 * @param warmth - Warmth level 0-100 (50 = neutral, <50 cooler blues, >50 warmer reds/yellows)
 * @returns Adjusted hex color string (e.g., "#FF6E47")
 *
 */
export const applySliderAdjustments = (
  hexColor: string,
  brightness: number,
  saturation: number,
  warmth: number
): string => {
  try {
    let color = Color(hexColor);

    // Brightness Adjustment
    // Convert slider value (0-100, neutral at 50) to adjustment delta (-50 to +50)
    const brightnessAdjust = (brightness - 50) / 2; // Scale to ±25 for smoother transitions
    const currentLightness = color.lightness();
    const newLightness = Math.max(0, Math.min(100, currentLightness + brightnessAdjust));
    color = color.lightness(newLightness);

    // Saturation Adjustment
    // Convert slider value to saturation multiplier
    const saturationAdjust = (saturation - 50) / 100; // -0.5 to +0.5
    color = color.saturate(saturationAdjust);

    // Warmth Adjustment
    // Shift hue: positive towards warm (reds/yellows), negative towards cool (blues/cyans)
    const warmthAdjust = (warmth - 50) / 50; // -1 to +1
    const currentHue = color.hue();
    const hueShift = warmthAdjust * 30; // Maximum ±30° hue shift
    const newHue = (currentHue + hueShift + 360) % 360; // Keep within 0-360 range
    color = color.hue(newHue);

    return color.hex().toUpperCase();
  } catch (error) {
    // Fallback to original color if conversion fails
    console.error('Error applying color adjustments:', { error });
    return hexColor;
  }
};

/**
 * Apply adjustments to an array of colors
 *
 * @param colors - Array of hex color strings
 * @param brightness - Brightness level 0-100
 * @param saturation - Saturation level 0-100
 * @param warmth - Warmth level 0-100
 * @returns Array of adjusted hex color strings
 */
export const applyAdjustmentsToColors = (
  colors: string[],
  brightness: number,
  saturation: number,
  warmth: number
): string[] => {
  return colors.map((color) => applySliderAdjustments(color, brightness, saturation, warmth));
};
