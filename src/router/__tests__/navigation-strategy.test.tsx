import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Link, RouterProvider, useRouter } from '@/router';

let resolvePrefetch: (() => void) | null = null;
const { getLoadedRouteComponentMock, isKnownRoutePathMock, prefetchRouteMock } = vi.hoisted(() => ({
  getLoadedRouteComponentMock: vi.fn(() => undefined),
  isKnownRoutePathMock: vi.fn((path: string) =>
    path === '/' ||
    path === '/deck' ||
    path === '/dashboard' ||
    path === '/protect'
  ),
  prefetchRouteMock: vi.fn(() => new Promise<void>((resolve) => {
    resolvePrefetch = resolve;
  })),
}));

vi.mock('@/router/lazyRoutes', () => ({
  getLoadedRouteComponent: getLoadedRouteComponentMock,
  isKnownRoutePath: isKnownRoutePathMock,
  prefetchRoute: (...args: unknown[]) => prefetchRouteMock(...args),
}));

function PathProbe() {
  const { path, pendingPath, showPendingIndicator } = useRouter();
  return (
    <>
      <output data-testid="router-path">{path}</output>
      <output data-testid="router-pending-path">{pendingPath ?? ''}</output>
      <output data-testid="router-pending-indicator">
        {showPendingIndicator ? 'visible' : 'hidden'}
      </output>
    </>
  );
}

describe('router navigation strategy', () => {
  beforeEach(() => {
    resolvePrefetch = null;
    prefetchRouteMock.mockClear();
    window.history.pushState({}, '', '/');
  });

  it('keeps blocking navigation waiting on route prefetch by default', async () => {
    render(
      <RouterProvider>
        <PathProbe />
        <Link to="/deck">Deck</Link>
      </RouterProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Deck' }));

    expect(screen.getByTestId('router-path').textContent).toBe('/');
    expect(window.location.pathname).toBe('/');
    expect(prefetchRouteMock).toHaveBeenCalledWith('/deck');

    resolvePrefetch?.();

    await waitFor(() => {
      expect(screen.getByTestId('router-path').textContent).toBe('/deck');
    });
  });

  it('commits optimistic navigation immediately while prefetch continues', () => {
    render(
      <RouterProvider>
        <PathProbe />
        <Link to="/deck" navigationStrategy="optimistic">Deck</Link>
      </RouterProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Deck' }));

    expect(screen.getByTestId('router-path').textContent).toBe('/deck');
    expect(window.location.pathname).toBe('/deck');
    expect(prefetchRouteMock).toHaveBeenCalledWith('/deck');
  });

  it('keeps app-shell navigation seamless until the route module is ready', async () => {
    vi.useFakeTimers();
    window.history.pushState({}, '', '/dashboard');

    render(
      <RouterProvider>
        <PathProbe />
        <Link to="/protect">Protect</Link>
      </RouterProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Protect' }));

    expect(screen.getByTestId('router-path').textContent).toBe('/dashboard');
    expect(screen.getByTestId('router-pending-path').textContent).toBe('/protect');
    expect(screen.getByTestId('router-pending-indicator').textContent).toBe('hidden');
    expect(window.location.pathname).toBe('/dashboard');

    act(() => {
      vi.advanceTimersByTime(801);
    });

    expect(screen.getByTestId('router-pending-indicator').textContent).toBe('visible');

    vi.useRealTimers();

    await act(async () => {
      resolvePrefetch?.();
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('router-path').textContent).toBe('/protect');
    });
    expect(screen.getByTestId('router-pending-path').textContent).toBe('');
    expect(screen.getByTestId('router-pending-indicator').textContent).toBe('hidden');
    expect(window.location.pathname).toBe('/protect');
  });
});
