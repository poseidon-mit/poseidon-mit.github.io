import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouterProvider } from '../../router';
import ProtectAlertDetail from '../../pages/ProtectAlertDetail';
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

  it('renders decision section with recommended actions', () => {
    renderPRT02();
    expect(screen.getByText(/Recommended actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Block & investigate/i)).toBeInTheDocument();
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

  it('has governance contract set', () => {
    const { container } = renderPRT02();
    const govFooter = container.querySelector('footer[aria-label="Governance verification footer"]');
    expect(govFooter).not.toBeNull();
  });

  it('provides dispute link', () => {
    renderPRT02();
    expect(screen.getByRole('link', { name: /Open execute queue/i })).toBeInTheDocument();
  });

  it('signal section appears before decision controls in DOM order', () => {
    const { container } = renderPRT02();
    const content = container.textContent ?? '';
    const signalPos = content.indexOf('Alert type');
    const decisionPos = content.indexOf('Recommended actions');
    expect(signalPos).toBeGreaterThanOrEqual(0);
    expect(decisionPos).toBeGreaterThanOrEqual(0);
    expect(signalPos).toBeLessThan(decisionPos);
  });
});
