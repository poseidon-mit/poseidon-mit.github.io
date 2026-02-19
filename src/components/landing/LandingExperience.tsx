import { useMemo } from 'react';
import { useRouter } from '@/router';
import { LandingPage } from './LandingPage';
import { JetonLandingPage } from './jeton/JetonLandingPage';
import {
  type LandingVariant,
  resolveLandingVariant,
} from './jeton/jeton-config';

const envVariant = import.meta.env.VITE_LANDING_VARIANT;

export function LandingExperience() {
  const { search } = useRouter();

  const variant = useMemo<LandingVariant>(
    () => resolveLandingVariant(search, envVariant),
    [search],
  );

  return (
    <div data-landing-variant={variant}>
      {variant === 'jeton' ? <JetonLandingPage /> : <LandingPage />}
    </div>
  );
}
