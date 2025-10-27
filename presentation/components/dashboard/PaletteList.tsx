'use client';

import { useOptimistic, useTransition } from 'react';
import { updatePaletteVisibility, deletePalette } from '@/actions/palette.actions';
import { PaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { getCurrentUser } from '@/actions/auth.actions';
import { PaletteCard } from './PaletteCard';
import { IoIosColorPalette } from 'react-icons/io';

interface PaletteListProps {
  initialPalettes: PaletteResponse[];
}

type OptimisticAction = { type: 'UPDATE_VISIBILITY'; id: string; isPublic: boolean } | { type: 'DELETE'; id: string };

export const PaletteList = ({ initialPalettes }: PaletteListProps) => {
  const [, startTransition] = useTransition();

  const [optimisticPalettes, setOptimisticPalettes] = useOptimistic<PaletteResponse[], OptimisticAction>(
    initialPalettes,
    (state, action) => {
      switch (action.type) {
        case 'UPDATE_VISIBILITY':
          return state.map((palette) =>
            palette.id === action.id ? { ...palette, is_public: action.isPublic } : palette
          );
        default:
          return state;
      }
    }
  );

  const handleToggleVisibility = async (id: string, isPublic: boolean) => {
    startTransition(() => {
      setOptimisticPalettes({ type: 'UPDATE_VISIBILITY', id, isPublic });
    });

    try {
      const user = await getCurrentUser();
      if (!user) return;

      const result = await updatePaletteVisibility(id, isPublic, user.id);

      if (!result.success) {
        console.error('Failed to update visibility:', result.error);
      }
    } catch (err) {
      console.error('Error updating visibility:', err);
    }
  };

  const handleDownload = (id: string) => {
    // TODO: Implement download functionality (export as PNG/JSON)
    console.log(`Download palette ${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this palette?')) {
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user) return;

      const result = await deletePalette(id, user.id);

      if (!result.success) {
        console.error('Failed to delete palette:', result.error);
        alert('Failed to delete palette. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting palette:', err);
      alert('An error occurred. Please try again.');
    }
  };

  if (optimisticPalettes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <IoIosColorPalette color='white' size={54} />
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white my-4'>No palettes yet</h2>
        <p className='text-slate-500 dark:text-slate-400 mb-6 max-w-md'>
          Your saved palettes will appear on this page.
        </p>
        <a
          href='/'
          className='flex h-10 items-center justify-center rounded-2xl bg-primary px-5 font-bold text-button-text transition-colors duration-200 ease-in-out hover:bg-primary/90'
        >
          Create Your First Palette
        </a>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-8'>
      {optimisticPalettes.map((palette) => (
        <PaletteCard
          key={palette.id}
          id={palette.id}
          name={palette.palette_name}
          rationale={palette.rationale}
          colors={palette.colors}
          isPublic={palette.is_public}
          onToggleVisibility={handleToggleVisibility}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
