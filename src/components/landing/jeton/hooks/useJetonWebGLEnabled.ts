import { useEffect, useMemo, useState } from 'react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface JetonHeroVideoEnabledInput {
  prefersReducedMotion: boolean;
  saveData: boolean;
  featureEnabled: boolean;
}

export function shouldEnableJetonHeroVideo({
  featureEnabled,
}: JetonHeroVideoEnabledInput): boolean {
  if (!featureEnabled) return false;
  return true;
}

export function useJetonHeroVideoEnabled(): boolean {
  const prefersReducedMotion = useReducedMotionSafe();
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    interface ConnectionLike {
      saveData?: boolean;
      addEventListener?: (type: 'change', listener: () => void) => void;
      removeEventListener?: (type: 'change', listener: () => void) => void;
    }

    const nav = navigator as Navigator & { connection?: ConnectionLike };
    const connection = nav.connection;
    const syncSaveData = () => {
      setSaveData(Boolean(connection?.saveData));
    };

    syncSaveData();
    connection?.addEventListener?.('change', syncSaveData);

    return () => {
      connection?.removeEventListener?.('change', syncSaveData);
    };
  }, []);

  const featureEnabled = import.meta.env.VITE_LANDING_HERO_VIDEO !== '0';

  return useMemo(
    () =>
      shouldEnableJetonHeroVideo({
        prefersReducedMotion,
        saveData,
        featureEnabled,
      }),
    [featureEnabled, prefersReducedMotion, saveData],
  );
}

// Backward-compat exports during migration of references.
export const shouldEnableJetonWebGL = shouldEnableJetonHeroVideo;
export const useJetonWebGLEnabled = useJetonHeroVideoEnabled;
