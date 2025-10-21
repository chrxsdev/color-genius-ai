import { ColorWheel } from './ColorWheel';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';

interface ColorVisualizationProps {
  colors: ColorItem[];
  brightness: number;
  saturation: number;
  warmth: number;
  onColorChange: (index: number, newColor: string) => void;
}

export const ColorVisualization = ({
  colors,
  brightness,
  saturation,
  warmth,
  onColorChange,
}: ColorVisualizationProps) => {
  return (
    <div className='mt-2 space-y-8 p-6'>
      <h3 className='text-xl font-bold text-white'>Color Visualization</h3>
      <ColorWheel
        colors={colors.map((item) => item.color)}
        size={400}
        onColorChange={onColorChange}
        brightness={brightness}
        saturation={saturation}
        warmth={warmth}
      />
      <div>
        <p className='text-subtitle text-sm text-center leading-relaxed'>
          You can adjust the colors using the palette control sliders or modify each color directly in the wheel.
        </p>
      </div>
    </div>
  );
};