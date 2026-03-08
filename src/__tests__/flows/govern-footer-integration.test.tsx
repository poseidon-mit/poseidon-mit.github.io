import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { RouterProvider } from '../../router';
import { AuthenticatedLayout } from '../../components/layout/AuthenticatedLayout';
import GovernAuditDetail from '../../pages/GovernAuditDetail';

/**
 * GovernFooter integration test — verifies footer appears at the correct
 * architectural layer (AuthenticatedLayout) and that the ticker interrupt
 * responds to CustomEvent broadcasts.
 */
describe('GovernFooter integration (AuthenticatedLayout)', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  function renderWithLayout() {
    window.history.pushState({}, '', '/govern/audit-detail?decision=GV-2026-0319-846');
    return render(
      <RouterProvider>
        <AuthenticatedLayout path="/govern/audit-detail">
          <GovernAuditDetail />
        </AuthenticatedLayout>
      </RouterProvider>,
    );
  }

  it('renders GovernFooter on /govern/audit-detail', () => {
    const { container } = renderWithLayout();
    expect(
      container.querySelector('footer[aria-label="Governance verification footer"]'),
    ).not.toBeNull();
  });

  it('ticker updates when poseidon:execute-approved event fires', () => {
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
    expect(footer).not.toBeNull();
    expect(footer!.textContent).toContain('EXECUTE INITIATED');
    expect(footer!.textContent).toContain('Portfolio rebalance');
    expect(footer!.textContent).toContain('GV-2026-0319-847');
  });
});
