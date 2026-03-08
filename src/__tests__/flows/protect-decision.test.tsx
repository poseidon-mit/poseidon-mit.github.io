import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouterProvider } from '../../router';
import ProtectAlertDetail from '../../pages/protect/ProtectAlertDetail';
import { DEMO_THREAD } from '../../lib/demo-thread';
import { formatConfidence } from '../../lib/demo-date';

/**
 * Protect decision flow: PRT02 evidence → decision order enforcement.
 * Critical rule: Signal → Evidence → Decision.
 */
describe('Protect decision flow (PRT02)', () => {
  function renderPRT02() {
    return render(
      <RouterProvider>
        <ProtectAlertDetail />
      </RouterProvider>,
    );
  }

  it('renders signal section', () => {
    renderPRT02();
    expect(screen.getAllByText(/Signal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Alert type/i)).toBeInTheDocument();
  });

  it('renders evidence section', () => {
    renderPRT02();
    expect(screen.getByText(/Evidence analysis/i)).toBeInTheDocument();
  });

  it('renders decision section with recommended action', () => {
    renderPRT02();
    expect(screen.getByText(/Recommended Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Block & Dispute/i)).toBeInTheDocument();
  });

  it('shows fraud severity as critical', () => {
    renderPRT02();
    // The severity chip renders "critical"
    expect(screen.getAllByText(/critical/i).length).toBeGreaterThan(0);
  });

  it('shows confidence score', () => {
    renderPRT02();
    const expected = formatConfidence(DEMO_THREAD.criticalAlert.confidence);
    expect(screen.getAllByText(expected).length).toBeGreaterThan(0);
  });

  it('has breadcrumb navigation', () => {
    const { container } = renderPRT02();
    const nav = container.querySelector('nav[aria-label="Breadcrumb"]');
    expect(nav).not.toBeNull();
  });

  it('provides dispute action button', () => {
    renderPRT02();
    expect(screen.getByRole('button', { name: /Block & Dispute/i })).toBeInTheDocument();
  });

  it('signal section appears before decision controls in DOM order', () => {
    const { container } = renderPRT02();
    const content = container.textContent ?? '';
    const signalPos = content.indexOf('Alert type');
    const decisionPos = content.indexOf('Recommended Action');
    expect(signalPos).toBeGreaterThanOrEqual(0);
    expect(decisionPos).toBeGreaterThanOrEqual(0);
    expect(signalPos).toBeLessThan(decisionPos);
  });
});
