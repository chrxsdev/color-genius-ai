'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { SiGooglegemini } from 'react-icons/si';
import { HARMONY_TYPES, type HarmonyType } from '@/types/palette';
import { MdArrowDropDown } from 'react-icons/md';

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

  const handleGenerate = () => {
    console.log('Generating palette with:', { prompt, harmony });
    // TODO: Implement palette generation
  };

  const handleGenerateName = () => {
    console.log('Generating palette name...');
    // TODO: Implement AI name generation
  };

  const incrementSlots = () => {
    if (colorSlots < 8) setColorSlots(colorSlots + 1);
  };

  const decrementSlots = () => {
    if (colorSlots > 4) setColorSlots(colorSlots - 1);
  };

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='mx-auto max-w-4xl'>
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
              <MdArrowDropDown size={25} className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className='flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-bold text-button-text transition-all duration-200 ease-in-out hover:bg-primary/90 hover:scale-105 cursor-pointer active:scale-95'
          >
            <SiGooglegemini className='text-xl' />
            Generate Palette
          </button>
        </div>

        {/* Palette Controls Section */}
        <div className='mt-10 space-y-8 rounded-xl border-2 border-neutral-variant p-6'>
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
      </div>
    </div>
  );
};

export default PalettePage;
