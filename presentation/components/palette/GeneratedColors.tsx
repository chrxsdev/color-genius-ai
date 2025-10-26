import { SiGooglegemini } from 'react-icons/si';
import { MdArrowDropDown } from 'react-icons/md';
import { IoHeartOutline, IoImageOutline } from 'react-icons/io5';
import { ColorCard } from './ColorCard';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';
import { Format } from '@/infrastructure/types/format.types';
import { Loader } from '../Loader';

interface GeneratedColorsProps {
  colors: ColorItem[];
  paletteName: string;
  colorFormat: Format;
  isRegeneratingName: boolean;
  rationale: string | null;
  onNameChange: (value: string) => void;
  onFormatChange: (value: Format) => void;
  onRegenerateName: () => void;
  isSaving?: boolean;
  onSave: () => void;
  onExport: () => void;
  colorsRef: React.RefObject<HTMLDivElement | null>;
}

export const GeneratedColors = ({
  colors,
  paletteName,
  colorFormat,
  isRegeneratingName,
  rationale,
  onNameChange,
  onFormatChange,
  onRegenerateName,
  onSave,
  onExport,
  colorsRef,
  isSaving = false,
}: GeneratedColorsProps) => {
  return (
    <div className='mt-2 space-y-4 p-6'>
      <h3 className='text-xl font-bold text-white'>Generated Colors</h3>

      <div className='flex flex-col md:flex-row gap-4 pt-4'>
        <div className='relative flex-1'>
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

      <div className='flex items-center justify-between my-10'>
        <div className='relative'>
          <select
            value={colorFormat}
            onChange={(e) => onFormatChange(e.target.value as 'HEX' | 'RGB')}
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

        <div className='flex items-center gap-3'>
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 h-10 rounded-xl bg-neutral-variant/20 transition-colors cursor-pointer ${
              isSaving ? 'bg-neutral-variant/50' : 'bg-neutral-variant/20 hover:bg-neutral-variant/30'
            }`}
          >
            {isSaving ? <Loader className='w-4 h-4' /> : <IoHeartOutline className='text-lg text-white' />}
            <span className='text-sm font-medium text-white'>Save</span>
          </button>
          <button
            onClick={onExport}
            className='flex items-center gap-2 px-4 h-10 rounded-xl bg-neutral-variant/20 hover:bg-neutral-variant/30 transition-colors cursor-pointer'
          >
            <IoImageOutline className='text-lg text-white' />
            <span className='text-sm font-medium text-white'>Export PNG</span>
          </button>
        </div>
      </div>

      <div className='my-14 p-2'>
        <div
          ref={colorsRef}
          className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-10 gap-x-2 md:gap-x-2 lg:gap-x-2'
        >
          {colors.map((colorItem, index) => (
            <ColorCard key={index} color={colorItem.color} name={colorItem.name} format={colorFormat} />
          ))}
        </div>
      </div>
    </div>
  );
};
