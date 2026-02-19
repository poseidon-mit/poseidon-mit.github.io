import { describe, expect, it } from 'vitest';
import { resolveLandingVariant } from '../jeton/jeton-config';

describe('resolveLandingVariant', () => {
  it('always resolves to jeton', () => {
    expect(resolveLandingVariant('', undefined)).toBe('jeton');
    expect(resolveLandingVariant('?landing=jeton', 'jeton')).toBe('jeton');
    expect(resolveLandingVariant('?landing=classic', 'classic')).toBe('jeton');
    expect(resolveLandingVariant('?landing=other', 'weird')).toBe('jeton');
  });
});
