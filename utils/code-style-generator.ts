import { ColorItem } from '@/types/palette';

export const generateTailwindV4Code = (colors: ColorItem[]): string => {
  const colorVariables = colors
    .map((item) => {
      const name = item.name.toLowerCase().replace(/\s+/g, '-');
      return `\t--color-${name}: ${item.color};`;
    })
    .join('\n');

  return ['@import "tailwindcss";', '', '@theme inline {', colorVariables, '}'].join('\n');
};

export const generateTailwindV3Code = (colors: ColorItem[]): string => {
  const colorEntries = colors
    .map((item) => {
      const name = item.name.toLowerCase().replace(/\s+/g, '-');
      return `        '${name}': '${item.color}',`;
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

export const generateCSSCode = (colors: ColorItem[]): string => {
  const cssVariables = colors
    .map((item) => {
      const name = item.name.toLowerCase().replace(/\s+/g, '-');
      return `  --color-${name}: ${item.color};`;
    })
    .join('\n');

  return [':root {', cssVariables, '}'].join('\n');
};
