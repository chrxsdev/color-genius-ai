'use client';

interface ColorSlotsProps {
  colorSlots: number;
  incrementSlots: () => void;
  decrementSlots: () => void;
  minSlots?: number;
  maxSlots?: number;
}

export const ColorSlots = ({
  colorSlots,
  incrementSlots,
  decrementSlots,
  minSlots = 4,
  maxSlots = 8,
}: ColorSlotsProps) => {
  return (
    <div className='flex w-full md:w-[20%] items-center rounded-xl border-2 border-neutral-variant h-12'>
      <button
        onClick={decrementSlots}
        disabled={colorSlots <= minSlots}
        className='flex h-full items-center justify-center px-3 text-control-text hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
      >
        <span className='text-xl font-bold'>−</span>
      </button>
      <div className='flex-1 h-full flex items-center justify-center border-neutral-variant'>
        <span className='text-sm font-medium text-white'>{colorSlots}</span>
      </div>
      <button
        onClick={incrementSlots}
        disabled={colorSlots >= maxSlots}
        className='flex h-full items-center justify-center px-3 text-control-text hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'
      >
        <span className='text-xl font-bold'>+</span>
      </button>
    </div>
  );
};
