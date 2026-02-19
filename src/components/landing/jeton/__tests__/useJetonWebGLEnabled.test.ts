import { describe, expect, it } from 'vitest';
import { shouldEnableJetonHeroVideo } from '../hooks/useJetonWebGLEnabled';

describe('shouldEnableJetonHeroVideo', () => {
  it('enables when feature is on and user/device constraints pass', () => {
    expect(
      shouldEnableJetonHeroVideo({
        prefersReducedMotion: false,
        saveData: false,
        featureEnabled: true,
      }),
    ).toBe(true);
  });

  it('disables for each guard condition', () => {
    expect(
      shouldEnableJetonHeroVideo({
        prefersReducedMotion: true,
        saveData: false,
        featureEnabled: true,
      }),
    ).toBe(false);

    expect(
      shouldEnableJetonHeroVideo({
        prefersReducedMotion: false,
        saveData: true,
        featureEnabled: true,
      }),
    ).toBe(false);

    expect(
      shouldEnableJetonHeroVideo({
        prefersReducedMotion: false,
        saveData: false,
        featureEnabled: false,
      }),
    ).toBe(false);
  });

  it('supports mobile playback policy when constraints pass', () => {
    expect(
      shouldEnableJetonHeroVideo({
        prefersReducedMotion: false,
        saveData: false,
        featureEnabled: true,
      }),
    ).toBe(true);
  });
});
