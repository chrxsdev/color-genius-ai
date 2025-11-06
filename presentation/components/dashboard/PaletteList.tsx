'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { updatePaletteVisibility, deletePalette } from '@/actions/palette.actions';
import { PaletteResponse } from '@/infrastructure/interfaces/palette-actions.interface';
import { getCurrentUser } from '@/actions/auth.actions';
import { PaletteCard } from './PaletteCard';
import { IoIosColorPalette } from 'react-icons/io';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { exportPaletteCardToPng } from '@/utils/export-to-png';

interface PaletteListProps {
  initialPalettes: PaletteResponse[];
}

type OptimisticAction = { type: 'UPDATE_VISIBILITY'; id: string; isPublic: boolean } | { type: 'DELETE'; id: string };

export const PaletteList = ({ initialPalettes }: PaletteListProps) => {
  const [, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paletteToDelete, setPaletteToDelete] = useState<string | null>(null);
  const [deletingPaletteId, setDeletingPaletteId] = useState<string | null>(null);

  const [optimisticPalettes, setOptimisticPalettes] = useOptimistic<PaletteResponse[], OptimisticAction>(
    initialPalettes,
    (state, action) => {
      switch (action.type) {
        case 'UPDATE_VISIBILITY':
          return state.map((palette) =>
            palette.id === action.id ? { ...palette, is_public: action.isPublic } : palette
          );
        case 'DELETE':
          return state.filter((palette) => palette.id !== action.id);
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

  const handleDownload = async (id: string) => {
    const palette = optimisticPalettes.find((p) => p.id === id);
    if (!palette) return;

    try {
      await exportPaletteCardToPng(id, palette.palette_name);
    } catch (err) {
      console.error('Error exporting palette:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setPaletteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!paletteToDelete) return;

    // Set deleting state
    setDeletingPaletteId(paletteToDelete);

    // Close dialog
    setDeleteDialogOpen(false);

    try {
      const user = await getCurrentUser();
      if (!user) return;

      startTransition(() => {
        setOptimisticPalettes({ type: 'DELETE', id: paletteToDelete });
      });

      const result = await deletePalette(paletteToDelete, user.id);

      if (!result.success) {
        console.error('Failed to delete palette:', result.error);
        toast.error('Failed to delete palette');
        return;
      }

      toast.success('Palette deleted successfully');
    } catch (err) {
      console.error('Error deleting palette:', err);
      toast.error('Failed to delete palette');
    } finally {
      setDeletingPaletteId(null);
      setPaletteToDelete(null);
    }
  };

  if (optimisticPalettes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <IoIosColorPalette color='white' size={54} />
        <h2 className='text-2xl font-boldtext-white my-4'>No palettes yet</h2>
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
    <div className='grid md:grid-cols-2 grid-cols-1 gap-8'>
      <AnimatePresence mode='sync'>
        {optimisticPalettes.map((palette, index) => {
          const delay = index * 0.04;

          return (
            <motion.div
              key={palette.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                delay,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <PaletteCard
                id={palette.id}
                name={palette.palette_name}
                rationale={palette.rationale}
                colors={palette.colors}
                isPublic={palette.is_public}
                isDeleting={deletingPaletteId === palette.id}
                onToggleVisibility={handleToggleVisibility}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title='Delete Palette'
        description='Are you sure you want to delete this palette? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
        variant='destructive'
      />
    </div>
  );
};
