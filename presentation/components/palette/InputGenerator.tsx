import { useState, useEffect } from 'react';
import { SiGooglegemini } from 'react-icons/si';
import { MdArrowDropDown } from 'react-icons/md';
import { BiSolidError } from 'react-icons/bi';
import { Loader } from '../Loader';
import { HarmonyType } from '@/infrastructure/types/harmony-types.types';
import { HARMONY_TYPES } from '@/utils/constants/harmony-types';
import { PromptValidationSchema } from '@/infrastructure/schemas/prompt-validation.schema';

interface InputGeneratorProps {
  prompt: string;
  harmony: string;
  isGenerating: boolean;
  error: string | null;
  onPromptChange: (value: string) => void;
  onHarmonyChange: (value: HarmonyType) => void;
  onGenerate: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputGenerator = ({
  prompt,
  harmony,
  isGenerating,
  error,
  onPromptChange,
  onHarmonyChange,
  onGenerate,
  onKeyDown,
}: InputGeneratorProps) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Validate prompt on change
  useEffect(() => {
    if (!touched || !prompt) {
      setValidationError(null);
      return;
    }

    const result = PromptValidationSchema.safeParse(prompt);
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
    } else {
      setValidationError(null);
    }
  }, [prompt, touched]);

  const handleBlur = () => {
    setTouched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Trigger validation on Enter
      if (!touched) {
        setTouched(true);
      }

      // Validate before calling parent handler
      const result = PromptValidationSchema.safeParse(prompt);
      if (!result.success) {
        setValidationError(result.error.issues[0].message);
        return; // Prevent submission
      }
    }

    // Call parent handler if validation passes
    onKeyDown(e);
  };

  const isDisabled = isGenerating || !prompt.trim() || !!validationError;
  const showValidationError = validationError && touched;

  return (
    <div className='flex flex-col animate__animated animate__fadeInDown'>
      <div className={`flex flex-col space-y-6 ${showValidationError ? 'md:mb-10 sm:mb-2' : ''}`}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className={`relative md:mb-0 ${showValidationError ? 'mb-8' : ''}`}>
            <input
              type='text'
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder='e.g., serene beach sunset'
              maxLength={50}
              className={`w-full rounded-xl border-2 ${
                validationError && touched
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-neutral-variant focus:ring-primary focus:border-primary'
              } bg-background h-14 pl-4 pr-4 text-base text-white placeholder:text-slate-500 focus:ring-1 outline-none transition-all`}
            />
            {validationError && touched && (
              <p className='absolute left-0 top-full my-2 text-xs text-red-400 leading-relaxed w-full'>{validationError}</p>
            )}
          </div>

          <div className='relative'>
            <select
              value={harmony}
              onChange={(e) => onHarmonyChange(e.target.value as HarmonyType)}
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
      </div>

      <div className='flex flex-col mt-4 mb-2'>
        <button
          onClick={onGenerate}
          disabled={isDisabled}
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

        {error && !validationError && (
          <div className='flex flex-row items-start p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-400 mt-4'>
            <BiSolidError className='text-base mx-2 mt-0.5 flex-shrink-0' />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
