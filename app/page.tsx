import type { ReactNode } from 'react';

interface PalettePageProps {
  children?: ReactNode;
}

const PalettePage = ({}: PalettePageProps) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4'>
      <h1 className='text-5xl md:text-7xl font-bold text-white text-center mb-4'>AI Color Palette Generator</h1>
      <p className='text-xl md:text-2xl text-neutral text-center font-light'>
        Describe the feeling or vibe you want to capture, and let AI create a palette that matches your vision.
      </p>
    </div>
  );
};

export default PalettePage;
