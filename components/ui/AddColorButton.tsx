'use client';

interface AddColorButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddColorButton = ({ onClick, className = '' }: AddColorButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 cursor-pointer group ${className}`}
    >
      {/* Dashed Circle with Plus Icon */}
      <div className='w-32 h-32 rounded-full border-2 border-dashed border-neutral-variant/50 flex items-center justify-center hover:border-neutral-variant/70 transition-colors'>
        <span className='text-4xl text-neutral-variant/50 group-hover:text-neutral-variant/70 transition-colors'>
          +
        </span>
      </div>
      <span className='text-sm text-neutral-variant/50 group-hover:text-neutral-variant/70 transition-colors'>Add Variant</span>
    </button>
  );
};
