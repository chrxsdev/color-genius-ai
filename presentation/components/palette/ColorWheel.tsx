'use client';

import { useState, useEffect, useRef } from 'react';
import { hexToHSL, hslToHex } from '@/utils/color-conversions/code-color-conversions';
import { applySliderAdjustments } from '@/utils/color-conversions/color-adjustments';

interface ColorWheelProps {
  colors: string[];
  onColorChange: (index: number, newColor: string) => void;
  brightness?: number;
  saturation?: number;
  warmth?: number;
}

interface ColorPosition {
  hue: number;
  saturation: number;
  lightness: number;
  radius: number; // Distance from center (0-1, where 1 is the edge)
}

export const ColorWheel = ({
  colors,
  onColorChange,
  brightness = 50,
  saturation = 50,
  warmth = 50,
}: ColorWheelProps) => {
  const [colorPositions, setColorPositions] = useState<ColorPosition[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [wheelSize, setWheelSize] = useState(400);
  const isDraggingRef = useRef(false);
  const previousColorsRef = useRef<string[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Sync color positions when colors prop changes (new palette generated) but NOT when user is dragging)
  useEffect(() => {
    // Don't update positions while dragging
    if (isDraggingRef.current) return;

    // Check if colors actually changed
    const colorsChanged = colors.some((color, index) => color !== previousColorsRef.current[index]);

    if (!colorsChanged) return;

    previousColorsRef.current = colors;

    const newPositions = colors.map((color) => {
      const hsl = hexToHSL(color);
      return {
        hue: hsl.hue,
        saturation: hsl.saturation,
        lightness: hsl.lightness,
        radius: hsl.saturation / 100, // Map saturation to radius
      };
    });
    setColorPositions(newPositions);
  }, [colors]); // Re-run when colors array changes

  // Update wheel size when component mounts or resizes
  useEffect(() => {
    const updateSize = () => {
      if (wheelRef.current) {
        const rect = wheelRef.current.getBoundingClientRect();
        setWheelSize(rect.width);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateSize, 100);

    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timeoutId);
    };
  }, []);

  const handlePointerDown = (index: number) => {
    setDraggingIndex(index);
    isDraggingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingIndex === null) return;

    // Prevent scrolling on mobile while dragging
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const pointerX = e.clientX - rect.left - centerX;
    const pointerY = e.clientY - rect.top - centerY;

    // Calculate distance from center
    const distance = Math.sqrt(pointerX * pointerX + pointerY * pointerY);
    const maxRadius = rect.width / 2;

    // Clamp distance to stay within the wheel
    const clampedDistance = Math.min(distance, maxRadius);

    // Calculate angle (0° = top, clockwise)
    const angle = Math.atan2(pointerY, pointerX) * (180 / Math.PI);
    const normalizedAngle = (angle + 90 + 360) % 360;

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

  const handlePointerUp = () => {
    setDraggingIndex(null);
    isDraggingRef.current = false;
  };

  // Don't render if no colors available yet
  if (colorPositions.length === 0) {
    return (
      <div className='flex items-center justify-center w-full aspect-square max-w-md mx-auto'>
        <div className='text-subtitle text-sm'>Waiting for colors...</div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <div
        ref={wheelRef}
        className='relative rounded-full select-none w-full aspect-square max-w-md touch-none'
        style={{
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
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {colorPositions.map((position, index) => {
          // Get current wheel dimensions
          const maxRadius = wheelSize / 2;

          // Convert hue angle to radians (0° = top, clockwise)
          const angleRad = ((position.hue - 90) * Math.PI) / 180;

          // Calculate actual distance from center based on radius percentage
          const actualRadius = position.radius * maxRadius;

          // Calculate x, y coordinates
          const x = Math.cos(angleRad) * actualRadius;
          const y = Math.sin(angleRad) * actualRadius;

          // Apply slider adjustments for display only (doesn't affect positioning)
          const displayColor = applySliderAdjustments(colors[index], brightness, saturation, warmth);

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
                className='absolute w-6 h-6 top-1/2 left-1/2 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing transition-shadow hover:shadow-xl touch-none'
                style={{
                  backgroundColor: displayColor,
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  boxShadow: draggingIndex === index ? '0 4px 12px rgba(0, 0, 0, 0.7)' : '0 2px 8px rgba(0, 0, 0, 0.5)',
                  zIndex: draggingIndex === index ? 10 : 1,
                }}
                onPointerDown={() => handlePointerDown(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
