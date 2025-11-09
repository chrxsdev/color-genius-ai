'use client';

import { useMemo, useState } from 'react';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';
import { CodeStyleFormat } from '@/infrastructure/enums/code-style-format.enum';
import { Format } from '@/infrastructure/types/format.types';
import { CodeStyleGenerator } from '@/utils/code-generators/code-style-generator';

interface ColorCodesProps {
  colors: ColorItem[];
  format: Format;
}

interface StyleCodeItem {
  code: string;
  language: string;
}

interface StyleCode {
  [key: string]: StyleCodeItem;
}

export const ColorCodes = ({ colors, format }: ColorCodesProps) => {
  const [activeTab, setActiveTab] = useState<CodeStyleFormat>(CodeStyleFormat.TailwindV4);
  const [copied, setCopied] = useState(false);

  const styleCode: StyleCode = useMemo(() => {
    return {
      [CodeStyleFormat.TailwindV4]: {
        code: CodeStyleGenerator.generateTailwindV4Code(colors, format),
        language: 'css',
      },
      [CodeStyleFormat.TailwindV3]: {
        code: CodeStyleGenerator.generateTailwindV3Code(colors, format),
        language: 'javascript',
      },
      [CodeStyleFormat.CSS]: {
        code: CodeStyleGenerator.generateCSSCode(colors, format),
        language: 'css',
      },
    };
  }, [activeTab, colors, format]);

  const handleCopy = async () => {
    if (copied) return;

    await navigator.clipboard.writeText(styleCode[activeTab].code);
    setCopied(true);
    toast.success('Code copied to clipboard', { duration: 3000 });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className='space-y-4 w-full'>
      {/* Tabs */}
      <div className='flex items-center gap-1 sm:gap-2 border-b border-neutral-variant/30 overflow-x-auto'>
        <button
          onClick={() => setActiveTab(CodeStyleFormat.TailwindV4)}
          className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer relative whitespace-nowrap ${
            activeTab === CodeStyleFormat.TailwindV4 ? 'text-primary' : 'text-control-text hover:text-white'
          }`}
        >
          TailwindCSS V4
          {activeTab === CodeStyleFormat.TailwindV4 && (
            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
          )}
        </button>
        <button
          onClick={() => setActiveTab(CodeStyleFormat.TailwindV3)}
          className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer relative whitespace-nowrap ${
            activeTab === CodeStyleFormat.TailwindV3 ? 'text-primary' : 'text-control-text hover:text-white'
          }`}
        >
          TailwindCSS V3
          {activeTab === CodeStyleFormat.TailwindV3 && (
            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
          )}
        </button>
        <button
          onClick={() => setActiveTab(CodeStyleFormat.CSS)}
          className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer relative whitespace-nowrap ${
            activeTab === CodeStyleFormat.CSS ? 'text-primary' : 'text-control-text hover:text-white'
          }`}
        >
          CSS
          {activeTab === 'css' && <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />}
        </button>
      </div>

      {/* Code Block */}
      <div className='relative rounded-xl bg-neutral/20 border border-neutral-variant/30 py-4 px-2 sm:px-3 md:px-6 w-full min-w-0'>
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className='absolute right-2 sm:right-4 top-4 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-variant/20 hover:bg-neutral-variant/30 transition-colors cursor-pointer z-10'
        >
          {copied ? (
            <IoCheckmark className='text-sm sm:text-base text-primary' />
          ) : (
            <IoCopyOutline className='text-sm sm:text-base text-white' />
          )}
        </button>

        {/* Code Content */}
        <div className='overflow-x-auto'>
          <SyntaxHighlighter
            language={styleCode[activeTab as CodeStyleFormat].language}
            style={vscDarkPlus}
            customStyle={{ 
              border: 12, 
              borderRadius: '0.5rem', 
              backgroundColor: 'transparent', 
              margin: 0,
              padding: 0, 
              fontSize: '0.12rem',
              overflowX: 'auto'
            }}
            wrapLongLines={false}
          >
            {styleCode[activeTab as CodeStyleFormat].code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};
