'use client';

import { useState, useEffect } from 'react';
import { MOBILE_BREAKPOINT } from '@/utils/constants/general-values';

interface UseMobileReturn {
  isMobile: boolean;
}

/**
 * Custom hook to detect if the device is mobile/touch-enabled
 * @param breakpoint - The screen width breakpoint in pixels (default: MOBILE_BREAKPOINT)
 * @returns Object containing isMobile boolean
 */
export const useMobile = (breakpoint: number = MOBILE_BREAKPOINT): UseMobileReturn => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < breakpoint;
      setIsMobile(isTouchDevice && isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return { isMobile };
};
