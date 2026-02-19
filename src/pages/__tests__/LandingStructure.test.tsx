import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { RouterProvider } from '../../router';
import Landing from '../Landing';

describe('Landing structure', () => {
  it('keeps skip link and main landmark', () => {
    const { container } = render(
      <RouterProvider>
        <Landing />
      </RouterProvider>,
    );

    const skipLink = container.querySelector('a[href="#main-content"]');
    const main = container.querySelector('main#main-content');

    expect(skipLink).not.toBeNull();
    expect(main).not.toBeNull();
    expect(main?.getAttribute('role')).toBe('main');
  });
});
