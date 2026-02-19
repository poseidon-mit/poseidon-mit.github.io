import { describe, expect, it } from 'vitest';
import { resolveLandingVariant } from '../jeton/jeton-config';

describe('resolveLandingVariant', () => {
  it('defaults to jeton', () => {
    expect(resolveLandingVariant('', undefined)).toBe('jeton');
  });

  it('uses env variant when query is absent', () => {
    expect(resolveLandingVariant('', 'jeton')).toBe('jeton');
    expect(resolveLandingVariant('', 'classic')).toBe('classic');
  });

  it('prefers query variant over env variant', () => {
    expect(resolveLandingVariant('?landing=jeton', 'classic')).toBe('jeton');
    expect(resolveLandingVariant('?landing=classic', 'jeton')).toBe('classic');
  });

  it('ignores unknown values', () => {
    expect(resolveLandingVariant('?landing=other', 'jeton')).toBe('jeton');
    expect(resolveLandingVariant('?landing=other', 'weird')).toBe('jeton');
  });
});
