'use client';

import { SiGooglegemini } from 'react-icons/si';

interface RegenerateInputProps {
  paletteName: string;
  isRegeneratingName: boolean;
  rationale: string | null;
  onNameChange: (value: string) => void;
  onRegenerateName: () => void;
}

export const RegenerateInput = ({
  paletteName,
  isRegeneratingName,
  rationale,
  onNameChange,
  onRegenerateName,
}: RegenerateInputProps) => {
  return (
    <div className='px-6 py-4'>
      <div className='relative w-full'>
        <input
          type='text'
          value={paletteName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder='e.g., Ocean Breeze'
          className='w-full rounded-xl border-2 border-neutral-variant bg-background h-12 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all'
        />
        <button
          onClick={onRegenerateName}
          disabled={isRegeneratingName || !rationale}
          className='absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          title='Regenerate Palette Name'
        >
          <SiGooglegemini className={`text-base text-primary ${isRegeneratingName ? 'animate-pulse' : ''}`} />
        </button>
      </div>
    </div>
  );
};
