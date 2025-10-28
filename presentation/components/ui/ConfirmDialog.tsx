'use client';

import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

/**
 * A reusable confirmation dialog component
 * @param open - Controls the open/closed state of the dialog
 * @param onOpenChange - Callback when the dialog state changes
 * @param onConfirm - Callback when the confirm button is clicked
 * @param title - The title of the dialog
 * @param description - The description/message of the dialog
 * @param confirmText - Text for the confirm button (default: "Continue")
 * @param cancelText - Text for the cancel button (default: "Cancel")
 * @param variant - Visual variant of the confirm button (default: "default")
 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='bg-background dark:bg-background-dark border-neutral-variant/30'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-white text-lg font-bold'>{title}</AlertDialogTitle>
          <AlertDialogDescription className='text-slate-600 dark:text-slate-400'>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer rounded-2xl border-neutral-variant/30 bg-background dark:bg-background-dark text-slate-600 dark:text-slate-300 hover:bg-neutral-variant/20'>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              'rounded-2xl cursor-pointer font-bold transition-colors duration-200',
              variant === 'destructive'
                ? 'bg-error text-slate-900 hover:bg-error/90'
                : 'bg-primary text-button-text hover:bg-primary/90'
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
