'use client';

import { Info } from 'lucide-react';
import { useMobile } from '@/presentation/hooks/useMobile';

interface MobileTapHintProps {
  show?: boolean;
  message?: string;
}

export const MobileTapHint = ({ show = true, message = 'Tap to see more information' }: MobileTapHintProps) => {
  const { isMobile } = useMobile();

  if (!isMobile || !show) {
    return null;
  }

  return (
    <div className='mb-4 text-center'>
      <span className='inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-800 shadow-md'>
        <Info className='w-4 h-4' />
        {message}
      </span>
    </div>
  );
};
