import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';
import { getColorValues } from '../color-conversions/code-color-conversions';
import { Format } from '@/infrastructure/types/format.types';

export class CodeStyleGenerator {
  static generateTailwindV4Code = (colors: ColorItem[], format: Format): string => {
    const colorVariables = colors
      .map((color) => {
        const { name, colorCode } = getColorValues(color, format);
        return `\t--color-${name}: ${colorCode};`;
      })
      .join('\n');

    return ['@import "tailwindcss";', '', '@theme inline {', colorVariables, '}'].join('\n');
  };

  static generateTailwindV3Code = (colors: ColorItem[], format: Format): string => {
    const colorEntries = colors
      .map((color) => {
        const { name, colorCode } = getColorValues(color, format);
        return `        '${name}': '${colorCode}',`;
      })
      .join('\n');

    return [
      'module.exports = {',
      '  theme: {',
      '    extend: {',
      '      colors: {',
      colorEntries,
      '      }',
      '    }',
      '  }',
      '}',
    ].join('\n');
  };

  static generateCSSCode = (colors: ColorItem[], format: Format): string => {
    const cssVariables = colors
      .map((color) => {
        const { name, colorCode } = getColorValues(color, format);
        return `  --color-${name}: ${colorCode};`;
      })
      .join('\n');

    return [':root {', cssVariables, '}'].join('\n');
  };
}
