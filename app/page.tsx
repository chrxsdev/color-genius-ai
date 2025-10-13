'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { SiGooglegemini } from 'react-icons/si';
import { MdArrowDropDown } from 'react-icons/md';
import { IoHeartOutline, IoImageOutline } from 'react-icons/io5';
import { ColorItem, Format, HARMONY_TYPES, type HarmonyType } from '@/types/palette';
import { ColorWheel } from '@/components/ui/ColorWheel';
import { ColorCard } from '@/components/ui/ColorCard';
import { AddColorButton } from '@/components/ui/AddColorButton';
import { ColorCodes } from '@/components/ui/ColorCodes';

interface PalettePageProps {
  children?: ReactNode;
}

const PalettePage = ({}: PalettePageProps) => {
  const [prompt, setPrompt] = useState('');
  const [harmony, setHarmony] = useState<HarmonyType>('analogous');
  const [brightness, setBrightness] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [warmth, setWarmth] = useState(50);
  const [paletteName, setPaletteName] = useState('');
  const [colorSlots, setColorSlots] = useState(5);
  const [colorFormat, setColorFormat] = useState<Format>('HEX');

  // State for AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rationale, setRationale] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  // Generated colors from AI
  const [generatedColors, setGeneratedColors] = useState<ColorItem[]>([
    { color: '#AAD291', name: 'Sage Green' },
    { color: '#BDCBB0', name: 'Misty Gray' },
    { color: '#A0CFCF', name: 'Teal Dream' },
    { color: '#FFB4AB', name: 'Coral Blush' },
    { color: '#E1E4D9', name: 'Ivory Mist' },
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a palette');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-palette', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          harmony,
          colorCount: colorSlots,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || data.message || 'Failed to generate palette');

      // Update state with AI-generated palette
      setGeneratedColors(data.colors);
      setRationale(data.metadata?.rationale || null);
      setTags(data.metadata?.tags || []);
      setPaletteName(''); // Clear any previous name
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateName = () => {
    console.log('Generating palette name...');
    // TODO: Implement AI name generation
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...generatedColors];
    newColors[index] = { ...newColors[index], color: newColor };
    setGeneratedColors(newColors);
  };

  const incrementSlots = () => {
    if (colorSlots < 8) setColorSlots(colorSlots + 1);
  };

  const decrementSlots = () => {
    if (colorSlots > 4) setColorSlots(colorSlots - 1);
  };

  const handleSave = () => {
    console.log('Saving palette...');
    // TODO: Implement save functionality
  };

  const handleExportSVG = () => {
    console.log('Exporting as SVG...');
    // TODO: Implement SVG export
  };

  const handleAddColor = () => {
    console.log('Adding new color...');
    // TODO: Implement add color functionality
  };

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='mx-auto max-w-5xl'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-bold tracking-tight text-white mb-4'>AI Color Palette Generator</h1>
          <p className='text-2lg text-subtitle mx-auto font-light'>
            Describe the feeling or vibe you want to capture, and let AI create a palette that matches your vision.
          </p>
        </div>

        {/* Generator Section */}
        <div className='space-y-6'>
          {/* Input and Select Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-end'>
            {/* Prompt Input */}
            <div className='relative'>
              <input
                type='text'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating && prompt.trim()) {
                    handleGenerate();
                  }
                }}
                placeholder='e.g., a serene beach sunset'
                className='w-full rounded-xl border-2 border-neutral-variant bg-background h-14 pl-4 pr-4 text-base text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all'
              />
            </div>

            {/* Harmony Select */}
            <div className='relative'>
              <select
                value={harmony}
                onChange={(e) => setHarmony(e.target.value as HarmonyType)}
                className='w-full rounded-xl border-2 border-neutral-variant bg-background h-14 pl-4 pr-12 text-base text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all cursor-pointer'
              >
                {HARMONY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <MdArrowDropDown
                size={25}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className='flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-bold text-button-text transition-all duration-200 ease-in-out hover:bg-primary/90 hover:scale-105 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          >
            {isGenerating ? (
              <>
                <svg
                  className='animate-spin h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SiGooglegemini className='text-xl' />
                Generate Palette
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className='mt-4 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-400'>
              <p className='font-medium'>⚠️ {error}</p>
            </div>
          )}

          {/* AI Insights */}
          {(rationale || tags.length > 0) && (
            <div className='mt-6 p-6 rounded-xl bg-neutral-variant/20 border-2 border-neutral-variant/50 space-y-4'>
              {rationale && (
                <div>
                  <h4 className='text-sm font-bold text-primary mb-2'>Design Rationale</h4>
                  <p className='text-subtitle text-sm leading-relaxed'>{rationale}</p>
                </div>
              )}
              {tags.length > 0 && (
                <div>
                  <h4 className='text-sm font-bold text-primary mb-2'>Tags</h4>
                  <div className='flex flex-wrap gap-2'>
                    {tags.map((tag) => (
                      <span key={tag} className='px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium'>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Palette Controls Section */}
        <div className='mt-8 space-y-8 rounded-xl border-2 border-neutral-variant p-6'>
          <h3 className='text-xl font-bold text-white'>Palette Controls</h3>

          {/* Sliders Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Brightness Slider */}
            <div className='space-y-3'>
              <label htmlFor='brightness' className='block font-medium text-slider-label'>
                Brightness
              </label>
              <input
                id='brightness'
                type='range'
                min='0'
                max='100'
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className='w-full h-2 bg-neutral/30 rounded-xl appearance-none cursor-pointer accent-primary'
              />
            </div>

            {/* Saturation Slider */}
            <div className='space-y-3'>
              <label htmlFor='saturation' className='block font-medium text-slider-label'>
                Saturation
              </label>
              <input
                id='saturation'
                type='range'
                min='0'
                max='100'
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className='w-full h-2 bg-neutral/30 rounded-xl appearance-none cursor-pointer accent-primary'
              />
            </div>

            {/* Warmth Slider */}
            <div className='space-y-3'>
              <label htmlFor='warmth' className='block font-medium text-slider-label'>
                Warmth
              </label>
              <input
                id='warmth'
                type='range'
                min='0'
                max='100'
                value={warmth}
                onChange={(e) => setWarmth(Number(e.target.value))}
                className='w-full h-2 bg-neutral/30 rounded-xl appearance-none cursor-pointer accent-primary'
              />
            </div>
          </div>

          {/* Name Input and Slot Control */}
          <div className='flex flex-col md:flex-row gap-4 pt-4'>
            {/* Palette Name Input with AI Button */}
            <div className='relative flex-1'>
              <input
                type='text'
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder='e.g., Ocean Breeze'
                className='w-full rounded-xl border-2 border-neutral-variant bg-background h-12 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all'
              />
              <button
                onClick={handleGenerateName}
                className='absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer'
              >
                <SiGooglegemini className='text-base text-primary' />
              </button>
            </div>

            {/* Color Slots Control */}
            <div className='flex w-full md:w-[20%] items-center rounded-xl border-2 border-neutral-variant h-12'>
              <button
                onClick={decrementSlots}
                disabled={colorSlots <= 4}
                className='flex h-full items-center justify-center px-3 text-control-text hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
              >
                <span className='text-xl font-bold'>−</span>
              </button>
              <div className='flex-1 h-full flex items-center justify-center border-neutral-variant'>
                <span className='text-sm font-medium text-white'>{colorSlots}</span>
              </div>
              <button
                onClick={incrementSlots}
                disabled={colorSlots >= 8}
                className='flex h-full items-center justify-center px-3 text-control-text hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
              >
                <span className='text-xl font-bold'>+</span>
              </button>
            </div>
          </div>
        </div>

        <div className='border-2 rounded-xl border-neutral-variant my-10'>
          {/* Color Visualization Section */}
          <div className='mt-2 space-y-8 p-6'>
            <h3 className='text-xl font-bold text-white'>Color Visualization</h3>
            <ColorWheel
              colors={generatedColors.map((item) => item.color)}
              size={400}
              onColorChange={handleColorChange}
            />
          </div>

          {/* Generated Colors Section */}
          <div className='mt-2 space-y-8 p-6'>
            <h3 className='text-xl font-bold text-white'>Generated Colors</h3>
            {/* Header with Format Select and Action Buttons */}
            <div className='flex items-center justify-between'>
              {/* Format Select */}
              <div className='relative'>
                <select
                  value={colorFormat}
                  onChange={(e) => setColorFormat(e.target.value as 'HEX' | 'RGB')}
                  className='md:w-32 rounded-xl border-2 border-neutral-variant bg-background h-10 pl-4 pr-10 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all cursor-pointer'
                >
                  <option value='HEX'>HEX</option>
                  <option value='RGB'>RGB</option>
                </select>
                <MdArrowDropDown
                  size={20}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-3'>
                <button
                  onClick={handleSave}
                  className='flex items-center gap-2 px-4 h-10 rounded-xl bg-neutral-variant/20 hover:bg-neutral-variant/30 transition-colors cursor-pointer'
                >
                  <IoHeartOutline className='text-lg text-white' />
                  <span className='text-sm font-medium text-white'>Save</span>
                </button>
                <button
                  onClick={handleExportSVG}
                  className='flex items-center gap-2 px-4 h-10 rounded-xl bg-neutral-variant/20 hover:bg-neutral-variant/30 transition-colors cursor-pointer'
                >
                  <IoImageOutline className='text-lg text-white' />
                  <span className='text-sm font-medium text-white'>Export SVG</span>
                </button>
              </div>
            </div>

            {/* Color Cards Grid */}
            <div className='my-20'>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-2 md:gap-x-2 lg:gap-x-2'>
                {generatedColors.map((colorItem, index) => (
                  <ColorCard key={index} color={colorItem.color} name={colorItem.name} format={colorFormat} />
                ))}
                {/* Add Color Button */}
                <AddColorButton onClick={handleAddColor} />
              </div>
            </div>

            {/* Color Codes Section */}
            <div className='mt-20'>
              <h3 className='text-xl font-bold text-white my-5'>Color Codes</h3>
              <ColorCodes colors={generatedColors} format={colorFormat} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PalettePage;
