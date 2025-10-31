'use client';

import { ExploreCard, HeightPattern } from './ExploreCard';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';

interface PaletteData {
  id: string;
  paletteName: string;
  username: string;
  colors: ColorItem[];
  likes: number;
}

// Mock data for testing - will be replaced with real data from API
const MOCK_PALETTES: PaletteData[] = [
  {
    id: '1',
    paletteName: 'Sunset Fire',
    username: 'creativeuser',
    colors: [
      { color: '#FF6B6B', name: 'Coral Red' },
      { color: '#C44569', name: 'Dark Rose' },
      { color: '#8B4513', name: 'Saddle Brown' },
      { color: '#A0826D', name: 'Tan Brown' },
      { color: '#4A5043', name: 'Dark Olive' },
    ],
    likes: 1200,
  },
  {
    id: '2',
    paletteName: 'Ocean Depths',
    username: 'bluewave',
    colors: [
      { color: '#1B4965', name: 'Deep Navy' },
      { color: '#5FA8D3', name: 'Sky Blue' },
      { color: '#BEE9E8', name: 'Light Cyan' },
      { color: '#CAE9FF', name: 'Pale Blue' },
      { color: '#0A1128', name: 'Dark Navy' },
    ],
    likes: 890,
  },
  {
    id: '3',
    paletteName: 'Pink Dreams',
    username: 'pastelart',
    colors: [
      { color: '#F8B4D9', name: 'Pink Rose' },
      { color: '#FFE5EC', name: 'Light Pink' },
      { color: '#FFDEE9', name: 'Pale Pink' },
      { color: '#FCD5CE', name: 'Peach Pink' },
      { color: '#FFE5E5', name: 'Blush' },
    ],
    likes: 2300,
  },
  {
    id: '4',
    paletteName: 'Earth Tones',
    username: 'naturalist',
    colors: [
      { color: '#F4E3C1', name: 'Cream' },
      { color: '#D4A574', name: 'Tan' },
      { color: '#B08968', name: 'Brown Sugar' },
      { color: '#7F5539', name: 'Coffee' },
      { color: '#3E3226', name: 'Dark Earth' },
    ],
    likes: 670,
  },
  {
    id: '5',
    paletteName: 'Forest Green',
    username: 'ecodesigner',
    colors: [
      { color: '#606C38', name: 'Olive Green' },
      { color: '#85A389', name: 'Sage' },
      { color: '#B7C4A4', name: 'Light Sage' },
      { color: '#C7DED0', name: 'Mint Cream' },
      { color: '#E8F3E8', name: 'Pale Green' },
    ],
    likes: 1450,
  },
  {
    id: '6',
    paletteName: 'Neon Nights',
    username: 'cyberpunk',
    colors: [
      { color: '#000000', name: 'Black' },
      { color: '#1A1A2E', name: 'Dark Blue' },
      { color: '#FF006E', name: 'Hot Pink' },
      { color: '#00F5FF', name: 'Electric Blue' },
      { color: '#FFBE0B', name: 'Neon Yellow' },
    ],
    likes: 3200,
  },
  {
    id: '7',
    paletteName: 'Vintage Warmth',
    username: 'retrovibes',
    colors: [
      { color: '#CB997E', name: 'Clay' },
      { color: '#DDBEA9', name: 'Taupe' },
      { color: '#FFE8D6', name: 'Peach Cream' },
      { color: '#B7B7A4', name: 'Sage Gray' },
      { color: '#A5A58D', name: 'Olive Gray' },
    ],
    likes: 980,
  },
  {
    id: '8',
    paletteName: 'Arctic Blue',
    username: 'frostdesign',
    colors: [
      { color: '#E3F2FD', name: 'Ice Blue' },
      { color: '#90CAF9', name: 'Sky' },
      { color: '#42A5F5', name: 'Ocean Blue' },
      { color: '#1E88E5', name: 'Deep Blue' },
      { color: '#0D47A1', name: 'Navy' },
    ],
    likes: 1560,
  },
  {
    id: '9',
    paletteName: 'Golden Hour',
    username: 'sunseeker',
    colors: [
      { color: '#FFF8DC', name: 'Cornsilk' },
      { color: '#FFD700', name: 'Gold' },
      { color: '#FFA500', name: 'Orange' },
      { color: '#FF8C00', name: 'Dark Orange' },
      { color: '#FF4500', name: 'Orange Red' },
    ],
    likes: 2100,
  },
];

// Generate a pattern sequence that repeats
const getHeightPattern = (index: number): HeightPattern => {
  const patterns: HeightPattern[] = ['short', 'tall', 'medium', 'extra-tall'];
  return patterns[index % patterns.length];
};

export const ExplorePaletteGrid = () => {
  return (
    <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'>
      {MOCK_PALETTES.map((palette, index) => (
        <div key={palette.id} className='break-inside-avoid'>
          <ExploreCard
            id={palette.id}
            paletteName={palette.paletteName}
            username={palette.username}
            colors={palette.colors}
            likes={palette.likes}
            heightPattern={getHeightPattern(index)}
          />
        </div>
      ))}
    </div>
  );
};
