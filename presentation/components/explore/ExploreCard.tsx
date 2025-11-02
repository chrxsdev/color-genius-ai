'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { ColorItem } from '@/infrastructure/interfaces/color-harmony.interface';
import { HeightPattern } from '@/infrastructure/types/height-patterns.types';
import { heightClasses } from '@/utils/constants/height-patterns';
import { togglePaletteLike } from '@/actions/palette.actions';
import { ROUTES } from '@/utils/constants/routes';

interface ExploreCardProps {
  id: string;
  paletteName: string;
  name: string;
  colors: ColorItem[];
  likes: number;
  isLiked: boolean;
  isAuthenticated: boolean;
  heightPattern?: HeightPattern;
  containerClassName?: string;
}

export const ExploreCard = ({
  id,
  paletteName,
  name,
  colors,
  likes: initialLikes,
  isLiked: initialIsLiked,
  isAuthenticated,
  heightPattern = 'medium',
  containerClassName,
}: ExploreCardProps) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [animate, setAnimate] = useState(false);
  const pendingActionRef = useRef<'like' | 'unlike' | null>(null);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If not authenticated, redirect immediately without any UI changes
    if (!isAuthenticated) {
      router.push(ROUTES.auth.signIn);
      return;
    }

    // Store the intended action
    const newIsLiked = !isLiked;
    pendingActionRef.current = newIsLiked ? 'like' : 'unlike';

    // Trigger animation
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);

    // Update the UI and feedback optimistically
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);

    // Use transition to batch the server update
    // This allows multiple clicks, but only the last action will be sent
    startTransition(async () => {
      const result = await togglePaletteLike(id);

      if (result.error) {
        // Revert optimistic update on errors
        setIsLiked(!newIsLiked);
        setLikesCount(initialLikes);
        toast.error(result.error);
      } else if (result.data) {
        // Update with actual values from server
        setIsLiked(result.data.isLiked);
        setLikesCount(result.data.likesCount);
      }

      pendingActionRef.current = null;
    });
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const paletteData = {
        name: paletteName,
        colors: colors.map((c) => ({
          name: c.name,
          color: c.color,
        })),
      };

      await navigator.clipboard.writeText(JSON.stringify(paletteData, null, 2));
      toast.success('Palette copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy palette');
      console.error('Copy error:', error);
    }
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer ${heightClasses[heightPattern]} ${containerClassName}`}
    >
      {/* Color Stripes Background */}
      <div className='absolute inset-0 flex flex-col rounded-2xl overflow-hidden'>
        {colors.map((colorItem, index) => (
          <div
            key={`${id}-${index}`}
            className='flex-1'
            style={{ backgroundColor: colorItem.color }}
            title={colorItem.name}
          />
        ))}
      </div>

      {/* Hover Overlay */}
      <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 rounded-2xl border-2 border-white'>
        {/* Top Section: Palette Name & Username */}
        <div className='absolute top-0 left-0 right-0 p-6 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
          <h3 className='text-xl font-bold text-white mb-1 drop-shadow-lg'>{paletteName}</h3>
          <p className='text-sm text-slate-200 drop-shadow-md'>by {name}</p>
        </div>

        {/* Bottom Section: Likes & Copy */}
        <div className='absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
          <button
            onClick={handleLike}
            className='flex items-center gap-2 transition-colors cursor-pointer hover:scale-110'
            aria-label={isLiked ? 'Unlike palette' : 'Like palette'}
          >
            <Heart
              className={`w-5 h-5 drop-shadow-lg transition-colors duration-200 ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-white'
              } ${animate ? 'animate-heartBeat' : ''}`}
            />
            <span className='text-white font-medium drop-shadow-lg'>
              {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
            </span>
          </button>

          {/* Copy Button */}
          <button
            className='p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors duration-200 cursor-pointer'
            onClick={handleCopy}
            aria-label='Copy palette'
          >
            <Copy className='w-5 h-5 text-white drop-shadow-lg' />
          </button>
        </div>
      </div>
    </div>
  );
};
