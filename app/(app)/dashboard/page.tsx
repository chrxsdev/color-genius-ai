'use client';

import { useState } from 'react';
import { PaletteCard } from '@/presentation/components/dashboard/PaletteCard';
import { Loader } from '@/presentation/components/Loader';

// Temporary mock data - will be replaced with actual data fetching
const mockPalettes = [
  {
    id: '1',
    name: 'Ocean Drive',
    rationale: 'A palette inspired by a coastal drive at dusk.',
    colors: [
      { color: '#3D5A80', name: 'Deep Blue' },
      { color: '#98C1D9', name: 'Sky Blue' },
      { color: '#E0FBFC', name: 'Mint Cream' },
      { color: '#EE6C4D', name: 'Burnt Sienna' },
      { color: '#293241', name: 'Gunmetal' },
    ],
    isPublic: true,
  },
  {
    id: '2',
    name: 'Pastel Meadows',
    rationale: 'Soft, gentle tones of a spring meadow in bloom.',
    colors: [
      { color: '#AAD291', name: 'Pistachio' },
      { color: '#BDCBB0', name: 'Tea Green' },
      { color: '#A0CFCF', name: 'Powder Blue' },
      { color: '#FFB4AB', name: 'Melon' },
      { color: '#E1E4D9', name: 'Bone' },
    ],
    isPublic: false,
  },
  {
    id: '3',
    name: 'Vibrant Citrus',
    rationale: 'A zesty, energetic palette full of life and color.',
    colors: [
      { color: '#F94144', name: 'Red Salsa' },
      { color: '#F3722C', name: 'Orange Red' },
      { color: '#F8961E', name: 'Yellow Orange' },
      { color: '#F9C74F', name: 'Saffron' },
      { color: '#90BE6D', name: 'Pistachio' },
    ],
    isPublic: true,
  },
];

const DashboardPage = () => {
  const [palettes, setPalettes] = useState(mockPalettes);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVisibility = (id: string, isPublic: boolean) => {
    setPalettes((prev) =>
      prev.map((palette) =>
        palette.id === id ? { ...palette, isPublic } : palette
      )
    );
    // TODO: Implement actual API call to update visibility
    console.log(`Toggle visibility for palette ${id} to ${isPublic}`);
  };

  const handleDownload = (id: string) => {
    // TODO: Implement download functionality (export as PNG/JSON)
    console.log(`Download palette ${id}`);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality with confirmation
    console.log(`Delete palette ${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
          My Saved Palettes
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400">
          Here are the color palettes you've saved. You can choose to make them public to share with the community.
        </p>
      </div>

      {/* Palette Grid */}
      {palettes.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {palettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              id={palette.id}
              name={palette.name}
              rationale={palette.rationale}
              colors={palette.colors}
              isPublic={palette.isPublic}
              onToggleVisibility={handleToggleVisibility}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            No palettes yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
            Start creating beautiful color palettes to see them here. Your saved palettes will appear on this page.
          </p>
          <a
            href="/"
            className="flex h-10 items-center justify-center rounded-2xl bg-primary px-5 font-bold text-button-text transition-colors duration-200 ease-in-out hover:bg-primary/90"
          >
            Create Your First Palette
          </a>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
