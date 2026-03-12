import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { RouterProvider } from '../../router';
import { AuthenticatedLayout } from '../../components/layout/AuthenticatedLayout';

/**
 * GovernFooter integration test — verifies footer appears at the correct
 * architectural layer (AuthenticatedLayout) and that the ticker interrupt
 * responds to CustomEvent broadcasts.
 *
 * Overview routes intentionally suppress the footer via route policy.
 * Detail routes use compact footer.
 */
describe('GovernFooter integration (AuthenticatedLayout)', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  function renderWithLayout() {
    window.history.pushState({}, '', '/dashboard');
    return render(
      <RouterProvider>
        <AuthenticatedLayout path="/dashboard">
          <div>Dashboard content</div>
        </AuthenticatedLayout>
      </RouterProvider>,
    );
  }

  it('omits GovernFooter on overview routes when route policy disables it', () => {
    const { container } = renderWithLayout();
    expect(
      container.querySelector('footer[aria-label="Governance verification footer"]'),
    ).toBeNull();
  });

  it('keeps overview routes free of footer chrome when ticker events fire', () => {
    const { container } = renderWithLayout();

    act(() => {
      window.dispatchEvent(
        new CustomEvent('poseidon:execute-approved', {
          detail: {
            govId: 'GV-2026-0319-847',
            actionId: 'EXE-001',
            actionTitle: 'Portfolio rebalance',
          },
        }),
      );
    });

    const footer = container.querySelector('footer[aria-label="Governance verification footer"]');
    expect(footer).toBeNull();
  });

  it('renders compact footer on detail routes', () => {
    window.history.pushState({}, '', '/govern/audit-detail?decision=GV-2026-0319-846');
    const { container } = render(
      <RouterProvider>
        <AuthenticatedLayout path="/govern/audit-detail">
          <div>Audit detail content</div>
        </AuthenticatedLayout>
      </RouterProvider>,
    );
    const footer = container.querySelector('footer[aria-label="Governance verification footer"]');
    expect(footer).not.toBeNull();
    // Compact footer has "Verified" badge but no ticker scroll
    expect(footer!.textContent).toContain('Verified');
    expect(footer!.textContent).not.toContain('Poseidon is monitoring');
  });
});
