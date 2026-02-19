import { describe, expect, it } from 'vitest';
import { shouldEnableJetonWebGL } from '../hooks/useJetonWebGLEnabled';

describe('shouldEnableJetonWebGL', () => {
  it('enables only when all constraints pass', () => {
    expect(
      shouldEnableJetonWebGL({
        isDesktop: true,
        prefersReducedMotion: false,
        saveData: false,
        featureEnabled: true,
      }),
    ).toBe(true);
  });

  it('disables for each guard condition', () => {
    expect(
      shouldEnableJetonWebGL({
        isDesktop: false,
        prefersReducedMotion: false,
        saveData: false,
        featureEnabled: true,
      }),
    ).toBe(false);

    expect(
      shouldEnableJetonWebGL({
        isDesktop: true,
        prefersReducedMotion: true,
        saveData: false,
        featureEnabled: true,
      }),
    ).toBe(false);

    expect(
      shouldEnableJetonWebGL({
        isDesktop: true,
        prefersReducedMotion: false,
        saveData: true,
        featureEnabled: true,
      }),
    ).toBe(false);

    expect(
      shouldEnableJetonWebGL({
        isDesktop: true,
        prefersReducedMotion: false,
        saveData: false,
        featureEnabled: false,
      }),
    ).toBe(false);
  });
});
