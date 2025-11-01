import { ControlColorOptions } from '@/infrastructure/interfaces/palette-slice.interface';

interface ColorControlsProps {
  brightness: number;
  saturation: number;
  warmth: number;
  onControlChange: (controls: ControlColorOptions) => void;
}

export const ColorControls = ({ brightness, saturation, warmth, onControlChange }: ColorControlsProps) => {
  return (
    <div className='space-y-4 py-6 px-6'>
      <h3 className='text-xl font-bold text-white'>Palette Controls</h3>
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
            onChange={(e) => onControlChange({ value: Number(e.target.value), key: 'brightness' })}
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
            onChange={(e) => onControlChange({ value: Number(e.target.value), key: 'saturation' })}
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
            onChange={(e) => onControlChange({ value: Number(e.target.value), key: 'warmth' })}
            className='w-full h-2 bg-neutral/30 rounded-xl appearance-none cursor-pointer accent-primary'
          />
        </div>
      </div>
    </div>
  );
};
