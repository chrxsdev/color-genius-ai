'use client';

import { useState, useRef, useEffect } from 'react';
import { redirect } from 'next/navigation';

import { InputGenerator } from '@/presentation/components/palette/InputGenerator';
import { AiInsights } from '@/presentation/components/palette/AiInsights';
import { ColorVisualization } from '@/presentation/components/palette/ColorVisualization';
import { GeneratedColors } from '@/presentation/components/palette/GeneratedColors';
import { ColorControls } from '@/presentation/components/palette/ColorControls';
import { ColorCodes } from '@/presentation/components/palette/ColorCodes';
import { RegenerateInput } from '@/presentation/components/palette/RegenerateInput';
import { DEFAULT_COLOR_COUNT } from '@/utils/constants/general-values';
import { getCurrentUser } from '@/actions/auth.actions';
import { useGeneratePaletteMutation, useRegenerateNameMutation } from '@/lib/redux/api/paletteApi';
import { useColorPalette } from '@/presentation/hooks/useColorPalette';
import { addPalette } from '@/actions/palette.actions';
import { HarmonyType } from '@/infrastructure/types/harmony-types.type';
import { ROUTES } from '@/utils/constants/routes';
import { exportElementToPng } from '@/utils/export-to-png';

const PalettePage = () => {
  const [prompt, setPrompt] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const {
    generatedColors,
    adjustedColors,
    paletteName,
    colorFormat,
    rationale,
    tags,
    harmony,
    colorOptionControl: { brightness, saturation, warmth },
    isHydrated,
    updateState,
    updateColorControl,
  } = useColorPalette();

  const [generatePalette] = useGeneratePaletteMutation();
  const [regenerateName] = useRegenerateNameMutation();
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegeneratingPaletteName, setIsRegeneratingPaletteName] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Color Reference to export
  const colorsGeneratedRef = useRef<HTMLDivElement>(null);

  // Handle initial mount animation
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    setIsSaving(true);

    const currentUser = await getCurrentUser();

    // If user is not authenticated, redirect to auth
    if (!currentUser) {
      // Save palette in local storage for unauthenticated users
      localStorage.setItem(
        'user_palette',
        JSON.stringify({
          generatedColors: adjustedColors,
          paletteName,
          colorFormat,
          rationale,
          tags,
          harmony,
          colorOptionControl: { brightness, saturation, warmth },
        })
      );
      return redirect(`${ROUTES.auth.signIn}?next=${ROUTES.home}`);
    }

    // If user is logged, save the palette and redirecting to the dashboard and clean storage

    const result = await addPalette({
      palette_name: paletteName,
      colors: adjustedColors,
      color_format: colorFormat,
      rationale,
      tags,
      harmony_type: harmony as HarmonyType,
      color_control: { brightness, saturation, warmth },
      user_id: currentUser.id,
    });

    if (result.success) {
      localStorage.removeItem('user_palette');
      return redirect(`${ROUTES.dashboard}`);
    }
  };

  const handleExportPNG = async () => {
    if (!colorsGeneratedRef.current) return;

    try {
      await exportElementToPng(colorsGeneratedRef.current, {
        fileName: `${paletteName ?? 'color-palette'}_${new Date().getTime().toString()}.png`,
      });
    } catch (err) {
      console.error('Error exporting palette:', err);
    }
  };

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8'>
      <div
        className={`flex flex-col items-center mx-auto max-w-4xl ${
          !isMounted || !isHydrated || generatedColors.length === 0 ? 'min-h-[80dvh] justify-center' : 'py-12'
        } transition-all duration-75`}
      >
        <div className={`w-full animate__animated ${isMounted ? 'animate__fadeInDown' : 'opacity-0'}`}>
          <div className='text-center mb-12'>
            <h1 className='text-5xl font-bold tracking-tight text-white mb-4'>AI Color Palette Generator</h1>
            <p className='text-2lg text-subtitle mx-auto font-light'>
              Describe the feeling or vibe you want to capture, and let Geni create a palette that matches your vision.
            </p>
          </div>

          <InputGenerator
            prompt={prompt}
            harmony={harmony}
            isGenerating={isGenerating}
            error={error}
            onPromptChange={setPrompt}
            onHarmonyChange={(value) => updateState({ harmony: value })}
            onGenerate={handleGenerate}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isGenerating && prompt.trim()) {
                handleGenerate();
              }
            }}
          />
        </div>

        {
          <div className={`animate__animated ${isMounted ? 'animate__fadeInUp' : 'opacity-0'} w-full`}>
            {isHydrated && generatedColors.length > 0 && (
              <div className='mt-2'>
                <AiInsights rationale={rationale} tags={tags} containerClassName='my-5' />
                <div className='border-2 rounded-xl border-neutral-variant my-5'>
                  <h3 className='text-xl font-bold text-white text-center mt-5'>Generate Palette Options</h3>

                  <RegenerateInput
                    paletteName={paletteName}
                    isRegeneratingName={isRegeneratingPaletteName}
                    rationale={rationale}
                    onNameChange={(value) => updateState({ paletteName: value })}
                    onRegenerateName={handleGenerateName}
                  />
                  <ColorVisualization
                    colors={generatedColors}
                    brightness={brightness}
                    saturation={saturation}
                    warmth={warmth}
                    onColorChange={handleColorChange}
                  />

                  <GeneratedColors
                    colors={adjustedColors}
                    colorFormat={colorFormat}
                    onFormatChange={(value) => updateState({ colorFormat: value })}
                    onSave={handleSave}
                    onExport={handleExportPNG}
                    colorsRef={colorsGeneratedRef}
                    isSaving={isSaving}
                  />

                  <ColorControls
                    brightness={brightness}
                    saturation={saturation}
                    warmth={warmth}
                    onControlChange={updateColorControl}
                  />

                  <div className='px-6 pb-4'>
                    <h3 className='text-xl font-bold text-white my-4'>Copy Color Codes</h3>
                    <ColorCodes colors={adjustedColors} format={colorFormat} />
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default PalettePage;
