'use client';

import { useState, useRef } from 'react';
import { SiGooglegemini } from 'react-icons/si';
import { MdArrowDropDown } from 'react-icons/md';
import { IoHeartOutline, IoImageOutline } from 'react-icons/io5';
import { toPng } from 'html-to-image';
import { BiSolidError } from 'react-icons/bi';
import { redirect } from 'next/navigation';

import { ColorWheel } from '@/presentation/components/palette/ColorWheel';
import { ColorCard } from '@/presentation/components/palette/ColorCard';
import { ColorCodes } from '@/presentation/components/palette/ColorCodes';
import { Loader } from '@/presentation/components/Loader';
import { DEFAULT_COLOR_COUNT } from '@/utils/constants/general-values';
import { HarmonyType } from '@/infrastructure/types/harmony-types.type';
import { HARMONY_TYPES } from '@/utils/constants/harmony-types';
import { getCurrentUser } from '@/actions/auth.actions';
import { useGeneratePaletteMutation, useRegenerateNameMutation } from '@/lib/redux/api/paletteApi';
import { useGeneratorControls } from '@/presentation/hooks/useGeneratorControls';
import { usePalette } from '@/presentation/hooks/usePalette';

const PalettePage = () => {
  // Generated colors from AI
  const [prompt, setPrompt] = useState('');

  const {
    generatedColors,
    adjustedColors,
    paletteName,
    colorFormat,
    rationale,
    tags,
    harmony,
    colorOptionControl: { brightness, saturation, warmth },
    updateState,
    updateColorControl,
  } = useGeneratorControls();
  const { savePaletteChanges } = usePalette();

  // Using RTK Query hooks to interact with the API
  const [generatePalette] = useGeneratePaletteMutation();
  const [regenerateName] = useRegenerateNameMutation();

  const [existingNames, setExistingNames] = useState<string[]>([]);

  // State for AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegeneratingPaletteName, setIsRegeneratingPaletteName] = useState(false);

  // Color Reference to export
  const colorsGeneratedRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a palette');
      return;
    }

    setError(null);
    try {
      setIsGenerating(true);
      const data = await generatePalette({ prompt: prompt.trim(), harmony, colorCount: DEFAULT_COLOR_COUNT }).unwrap();

      // Update state with AI-generated palette
      updateState({
        generatedColors: data.colors,
        rationale: data.metadata?.rationale ?? null,
        tags: data.metadata?.tags ?? [],
        paletteName: data.paletteName ?? '',
      });
      setExistingNames([data.paletteName]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateName = async () => {
    if (!rationale) {
      setError('Cannot regenerate palette name without rationale');
      return;
    }

    setError(null);
    try {
      setIsRegeneratingPaletteName(true);
      const data = await regenerateName({ rationale, harmony, generatedNames: existingNames }).unwrap();

      updateState({ paletteName: data.name });
      setExistingNames((prev) => [...prev, data.name].filter(Boolean));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Palette name regeneration error:', err);
    } finally {
      setIsRegeneratingPaletteName(false);
    }
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...generatedColors];
    newColors[index] = { ...newColors[index], color: newColor };
    updateState({ generatedColors: newColors });
  };

  const handleSave = async () => {
    const currentUser = await getCurrentUser();

    /**
     * TODO:
     * - If user is not authenticated, save the current palette in redux state and then redirect to sign-in page
     * - If user is authenticated, save the palette and redirect to dashboard
     */

    if (!currentUser) {
      // Save the last changes of the color palette
      savePaletteChanges({
        colors: generatedColors,
        paletteName,
        colorFormat,
        rationale,
        tags,
        harmony,
        colorControl: { brightness, saturation, warmth },
      });
      return redirect('auth/sign-in');
    }
  };

  const handleExportPNG = async () => {
    if (!colorsGeneratedRef.current) return;

    const dataUrl = await toPng(colorsGeneratedRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      style: {
        backgroundColor: '#1a1c19',
      },
    });

    const link = document.createElement('a');
    link.download = `${paletteName ?? 'color-palette'}_${new Date().getTime().toString()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='mx-auto max-w-5xl'>
        <div
          className={
            generatedColors.length === 0 ? 'min-h-[calc(100vh-250px)] flex flex-col justify-center' : 'my-auto'
          }
        >
          {/* Header Section */}
          <div className='text-center mb-12'>
            <h1 className='text-5xl font-bold tracking-tight text-white mb-4'>AI Color Palette Generator</h1>
            <p className='text-2lg text-subtitle mx-auto font-light'>
              Describe the feeling or vibe you want to capture, and let Geni create a palette that matches your vision.
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
                  onChange={(e) => updateState({ harmony: e.target.value as HarmonyType })}
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
                <Loader className='w-5 h-5' message='Generating...' />
              ) : (
                <>
                  <SiGooglegemini className='text-xl' />
                  Generate Palette
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className='flex flex-row items-center mt-4 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-400'>
                <BiSolidError className='text-base mx-2' /> {error}
              </div>
            )}

            {/* AI Insights */}
            {(rationale || tags.length > 0) && (
              <div className='mt-6 p-6 rounded-xl bg-neutral-variant/20 border-2 border-neutral-variant/50 space-y-4'>
                {rationale && (
                  <div>
                    <h4 className='text-sm font-bold text-primary mb-2'>Why this colors?</h4>
                    <p className='text-subtitle text-sm leading-relaxed'>{rationale}</p>
                  </div>
                )}
                {tags.length > 0 && (
                  <div>
                    <h4 className='text-sm font-bold text-primary mb-2'>Tags</h4>
                    <div className='flex flex-wrap gap-2'>
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className='px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium'
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {generatedColors.length > 0 && (
          <div className='mt-10'>
            <div className='border-2 rounded-xl border-neutral-variant my-10'>
              {/* Color Visualization Section */}
              <div className='mt-2 space-y-8 p-6'>
                <h3 className='text-xl font-bold text-white'>Color Visualization</h3>
                <ColorWheel
                  colors={generatedColors.map((item) => item.color)}
                  size={400}
                  onColorChange={handleColorChange}
                  brightness={brightness}
                  saturation={saturation}
                  warmth={warmth}
                />
                <div>
                  <p className='text-subtitle text-sm text-center leading-relaxed'>
                    You can adjust the colors using the palette control sliders or modify each color directly in the
                    wheel.
                  </p>
                </div>
              </div>
              {/* Generated Colors Section */}
              <div className='mt-2 space-y-4 p-6'>
                <h3 className='text-xl font-bold text-white'>Generated Colors</h3>

                {/* Name Input and Slot Control */}
                <div className='flex flex-col md:flex-row gap-4 pt-4'>
                  {/* Palette Name Input with AI Button */}
                  <div className='relative flex-1'>
                    <input
                      type='text'
                      value={paletteName}
                      onChange={(e) => updateState({ paletteName: e.target.value })}
                      placeholder='e.g., Ocean Breeze'
                      className='w-full rounded-xl border-2 border-neutral-variant bg-background h-12 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all'
                    />
                    <button
                      onClick={handleGenerateName}
                      disabled={isRegeneratingPaletteName || !rationale}
                      className='absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                      title='Regenerate Palette Name'
                    >
                      <SiGooglegemini
                        className={`text-base text-primary ${isRegeneratingPaletteName ? 'animate-pulse' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Header with Format Select and Action Buttons */}
                <div className='flex items-center justify-between my-10'>
                  {/* Format Select */}
                  <div className='relative'>
                    <select
                      value={colorFormat}
                      onChange={(e) => updateState({ colorFormat: e.target.value as 'HEX' | 'RGB' })}
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
                      onClick={handleExportPNG}
                      className='flex items-center gap-2 px-4 h-10 rounded-xl bg-neutral-variant/20 hover:bg-neutral-variant/30 transition-colors cursor-pointer'
                    >
                      <IoImageOutline className='text-lg text-white' />
                      <span className='text-sm font-medium text-white'>Export PNG</span>
                    </button>
                  </div>
                </div>

                {/* Color Cards Grid */}
                <div className='my-14 p-2'>
                  <div
                    ref={colorsGeneratedRef}
                    className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-2 md:gap-x-2 lg:gap-x-2'
                  >
                    {adjustedColors.map((colorItem, index) => (
                      <ColorCard key={index} color={colorItem.color} name={colorItem.name} format={colorFormat} />
                    ))}
                  </div>
                </div>

                {/* Palette Controls Section */}
                <div className='space-y-8 py-2'>
                  <h3 className='text-xl font-bold text-white'>Palette Controls</h3>
                  {/* Sliders Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {/* Brightness Slider */}
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <label htmlFor='brightness' className='block font-medium text-slider-label'>
                          Brightness
                        </label>
                        <span className='text-xs text-subtitle font-mono'>
                          {brightness === 50 ? '0' : brightness > 50 ? `+${brightness - 50}` : `${brightness - 50}`}
                        </span>
                      </div>
                      <input
                        id='brightness'
                        type='range'
                        min='0'
                        max='100'
                        value={brightness}
                        onChange={(e) => updateColorControl({ value: Number(e.target.value), key: 'brightness' })}
                        className='w-full h-2 bg-neutral/30 rounded-xl appearance-none cursor-pointer accent-primary'
                      />
                    </div>

                    {/* Saturation Slider */}
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <label htmlFor='saturation' className='block font-medium text-slider-label'>
                          Saturation
                        </label>
                        <span className='text-xs text-subtitle font-mono'>
                          {saturation === 50 ? '0' : saturation > 50 ? `+${saturation - 50}` : `${saturation - 50}`}
                        </span>
                      </div>
                      <input
                        id='saturation'
                        type='range'
                        min='0'
                        max='100'
                        value={saturation}
                        onChange={(e) => updateColorControl({ value: Number(e.target.value), key: 'saturation' })}
                        className='w-full h-2 bg-neutral/30 rounded-xl appearance-none cursor-pointer accent-primary'
                      />
                    </div>

                    {/* Warmth Slider */}
                    <div className='space-y-3'>
                      <div className='flex justify-between items-center'>
                        <label htmlFor='warmth' className='block font-medium text-slider-label'>
                          Warmth
                        </label>
                        <span className='text-xs text-subtitle font-mono'>
                          {warmth === 50 ? '0' : warmth > 50 ? `+${warmth - 50}` : `${warmth - 50}`}
                        </span>
                      </div>
                      <input
                        id='warmth'
                        type='range'
                        min='0'
                        max='100'
                        value={warmth}
                        onChange={(e) => updateColorControl({ value: Number(e.target.value), key: 'warmth' })}
                        className='w-full h-2 bg-neutral/30 rounded-xl appearance-none cursor-pointer accent-primary'
                      />
                    </div>
                  </div>
                </div>

                {/* Color Codes Section */}
                <div className='mt-10'>
                  <h3 className='text-xl font-bold text-white my-5'>Color Codes</h3>
                  <ColorCodes colors={adjustedColors} format={colorFormat} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PalettePage;
