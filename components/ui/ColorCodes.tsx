'use client';

import { useState } from 'react';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type CodeFormat = 'tailwind' | 'tailwindv3' | 'css';

interface ColorCodesProps {
  colors: string[];
  colorNames: string[];
}

export const ColorCodes = ({ colors, colorNames }: ColorCodesProps) => {
  const [activeTab, setActiveTab] = useState<CodeFormat>('tailwind');
  const [copied, setCopied] = useState(false);

  const generateTailwindCode = (): string => {
    const colorEntries = colors
      .map((color, index) => {
        const name = colorNames[index].toLowerCase().replace(/\s+/g, '-');
        return `      '${name}': '${color}',`;
      })
      .join('\n');

    return `@import "tailwindcss";

@theme inline {
  --color-${colorNames[0].toLowerCase().replace(/\s+/g, '-')}: ${colors[0]};
${colors
  .slice(1)
  .map((color, index) => `  --color-${colorNames[index + 1].toLowerCase().replace(/\s+/g, '-')}: ${color};`)
  .join('\n')}
}`;
  };

  const generateTailwindV3Code = (): string => {
    const colorEntries = colors
      .map((color, index) => {
        const name = colorNames[index].toLowerCase().replace(/\s+/g, '-');
        return `        '${name}': '${color}',`;
      })
      .join('\n');

    return `module.exports = {
  theme: {
    extend: {
      colors: {
${colorEntries}
      }
    }
  }
}`;
  };

  const generateCSSCode = (): string => {
    const cssVariables = colors
      .map((color, index) => {
        const name = colorNames[index].toLowerCase().replace(/\s+/g, '-');
        return `  --color-${name}: ${color};`;
      })
      .join('\n');

    return `:root {
${cssVariables}
}`;
  };

  const getCode = (): string => {
    switch (activeTab) {
      case 'tailwind':
        return generateTailwindCode();
      case 'tailwindv3':
        return generateTailwindV3Code();
      case 'css':
        return generateCSSCode();
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='space-y-4'>
      {/* Tabs */}
      <div className='flex items-center gap-2 border-b border-neutral-variant/30'>
        <button
          onClick={() => setActiveTab('tailwind')}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer relative ${
            activeTab === 'tailwind' ? 'text-primary' : 'text-control-text hover:text-white'
          }`}
        >
          TailwindCSS V4
          {activeTab === 'tailwind' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />}
        </button>
        <button
          onClick={() => setActiveTab('tailwindv3')}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer relative ${
            activeTab === 'tailwindv3' ? 'text-primary' : 'text-control-text hover:text-white'
          }`}
        >
          TailwindCSS V3
          {activeTab === 'tailwindv3' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />}
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer relative ${
            activeTab === 'css' ? 'text-primary' : 'text-control-text hover:text-white'
          }`}
        >
          CSS
          {activeTab === 'css' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />}
        </button>
      </div>

      {/* Code Block */}
      <div className='relative rounded-xl bg-neutral/20 border border-neutral-variant/30 p-6'>
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className='absolute right-4 top-4 flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-variant/20 hover:bg-neutral-variant/30 transition-colors cursor-pointer'
        >
          {copied ? (
            <IoCheckmark className='text-base text-primary' />
          ) : (
            <IoCopyOutline className='text-base text-white' />
          )}
        </button>

        {/* Code Content */}

        <SyntaxHighlighter
          language={activeTab === 'css' ? 'css' : 'javascript'}
          style={vscDarkPlus}
          customStyle={{ border: 2, borderRadius: '0.5rem', backgroundColor: 'transparent', margin: 0, padding: 0 }}
        >
          {getCode()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
