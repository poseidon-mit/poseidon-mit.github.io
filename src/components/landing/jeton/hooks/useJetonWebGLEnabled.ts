import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface JetonWebGLEnabledInput {
  isDesktop: boolean;
  prefersReducedMotion: boolean;
  saveData: boolean;
  featureEnabled: boolean;
}

export function shouldEnableJetonWebGL({
  isDesktop,
  prefersReducedMotion,
  saveData,
  featureEnabled,
}: JetonWebGLEnabledInput): boolean {
  if (!featureEnabled) return false;
  if (!isDesktop) return false;
  if (prefersReducedMotion) return false;
  if (saveData) return false;
  return true;
}

export function useJetonWebGLEnabled(): boolean {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useReducedMotionSafe();
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    setSaveData(Boolean(nav.connection?.saveData));
  }, []);

  const featureEnabled = import.meta.env.VITE_LANDING_WEBGL !== '0';

  return useMemo(
    () =>
      shouldEnableJetonWebGL({
        isDesktop,
        prefersReducedMotion,
        saveData,
        featureEnabled,
      }),
    [featureEnabled, isDesktop, prefersReducedMotion, saveData],
  );
}
