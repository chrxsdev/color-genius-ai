'use client';

import { useState } from 'react';
import { hexToHSL, hslToHex } from '@/utils/colorConversions';

interface ColorWheelProps {
  colors: string[];
  size?: number;
  onColorChange: (index: number, newColor: string) => void;
}

interface ColorPosition {
  hue: number;
  saturation: number;
  lightness: number;
  radius: number; // Distance from center (0-1, where 1 is the edge)
}

export const ColorWheel = ({ colors, size = 400, onColorChange }: ColorWheelProps) => {
  const [colorPositions, setColorPositions] = useState<ColorPosition[]>(() =>
    colors.map((color) => {
      const hsl = hexToHSL(color);
      return {
        hue: hsl.hue,
        saturation: hsl.saturation,
        lightness: hsl.lightness,
        radius: hsl.saturation / 100, // Map saturation to radius
      };
    })
  );
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const maxRadius = size / 2;

  const handleMouseDown = (index: number) => {
    setDraggingIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIndex === null) return;

    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;

    // Calculate distance from center
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    
    // Clamp distance to stay within the wheel
    const clampedDistance = Math.min(distance, maxRadius);
    
    // Calculate angle (0° = top, clockwise)
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    const normalizedAngle = ((angle + 90 + 360) % 360);
    
    // Calculate radius as percentage (0-1)
    const radiusPercent = clampedDistance / maxRadius;
    
    // Map radius to saturation (closer to center = less saturated)
    const saturation = radiusPercent * 100;
    
    // Keep lightness at 50% for vibrant colors (can be adjusted)
    const lightness = 50;

    const newPositions = [...colorPositions];
    newPositions[draggingIndex] = {
      hue: normalizedAngle,
      saturation,
      lightness,
      radius: radiusPercent,
    };
    setColorPositions(newPositions);

    const newColor = hslToHex(normalizedAngle, saturation, lightness);
    onColorChange(draggingIndex, newColor);
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  return (
    <div className='flex items-center justify-center'>
      <div
        className='relative rounded-full select-none'
        style={{
          width: size,
          height: size,
          background: `conic-gradient(
            from 0deg,
            hsl(0, 100%, 50%),
            hsl(60, 100%, 50%),
            hsl(120, 100%, 50%),
            hsl(180, 100%, 50%),
            hsl(240, 100%, 50%),
            hsl(300, 100%, 50%),
            hsl(360, 100%, 50%)
          )`,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {colorPositions.map((position, index) => {
          // Convert hue angle to radians (0° = top, clockwise)
          const angleRad = ((position.hue - 90) * Math.PI) / 180;
          
          // Calculate actual distance from center based on radius percentage
          const actualRadius = position.radius * maxRadius;
          
          // Calculate x, y coordinates
          const x = Math.cos(angleRad) * actualRadius;
          const y = Math.sin(angleRad) * actualRadius;

          return (
            <div key={index}>
              {/* Line from center to marker */}
              <div
                className='absolute top-1/2 left-1/2 origin-left h-0.5'
                style={{
                  width: `${actualRadius}px`,
                  backgroundColor: 'var(--color-wheel-line)',
                  transform: `rotate(${position.hue - 90}deg)`,
                  pointerEvents: 'none',
                  opacity: 0.6,
                }}
              />
              {/* Draggable color marker */}
              <div
                className='absolute w-6 h-6 top-1/2 left-1/2 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing transition-shadow hover:shadow-xl'
                style={{
                  backgroundColor: colors[index],
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  boxShadow: draggingIndex === index 
                    ? '0 4px 12px rgba(0, 0, 0, 0.7)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.5)',
                  zIndex: draggingIndex === index ? 10 : 1,
                }}
                onMouseDown={() => handleMouseDown(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};