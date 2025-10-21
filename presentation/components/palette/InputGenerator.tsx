import { SiGooglegemini } from 'react-icons/si';
import { MdArrowDropDown } from 'react-icons/md';
import { BiSolidError } from 'react-icons/bi';
import { Loader } from '../Loader';
import { HarmonyType } from '@/infrastructure/types/harmony-types.type';
import { HARMONY_TYPES } from '@/utils/constants/harmony-types';

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
  return (
    <div className='space-y-6 animate__animated animate__fadeInUp'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-end'>
        <div className='relative'>
          <input
            type='text'
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='e.g., a serene beach sunset'
            className='w-full rounded-xl border-2 border-neutral-variant bg-background h-14 pl-4 pr-4 text-base text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all'
          />
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

      <button
        onClick={onGenerate}
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

      {error && (
        <div className='flex flex-row items-center mt-4 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-400'>
          <BiSolidError className='text-base mx-2' /> {error}
        </div>
      )}
    </div>
  );
};