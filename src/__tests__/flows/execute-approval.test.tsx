import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { RouterProvider } from '../../router';
import ExecuteApproval from '../../pages/ExecuteApproval';

/**
 * Execute approval flow: EXE02 consent-gated approval.
 * Critical rule: Approve button disabled until consent checkbox checked.
 */
describe('Execute approval flow (EXE02)', () => {
  beforeEach(() => {
    // Set URL to a valid action so the approval page renders
    window.history.pushState({}, '', '/execute/approval?actionId=EXE-001');
  });

  function renderEXE02() {
    return render(
      <RouterProvider>
        <ExecuteApproval />
      </RouterProvider>,
    );
  }

  it('starts with approve button disabled', () => {
    renderEXE02();
    const approveBtn = screen.getByRole('button', { name: /Approve Action/i });
    expect(approveBtn).toBeDisabled();
  });

  it('enables approve button after consent scope is reviewed', () => {
    const { container } = renderEXE02();

    // Check the consent checkbox via its label
    const consentLabel = container.querySelector('[data-slot="consent_scope"]') as HTMLElement;
    expect(consentLabel).not.toBeNull();
    const checkbox = consentLabel.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(checkbox);

    // After checking, button becomes enabled
    const approveBtn = screen.getByRole('button', { name: /Approve Action/i });
    expect(approveBtn).not.toBeDisabled();
  });

  it('consent checkbox toggles correctly', () => {
    const { container } = renderEXE02();

    const consentLabel = container.querySelector('[data-slot="consent_scope"]') as HTMLElement;
    const checkbox = consentLabel.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('shows decision drivers section', () => {
    renderEXE02();
    expect(screen.getByText(/Decision Drivers/i)).toBeInTheDocument();
  });

  it('shows expected outcome section', () => {
    renderEXE02();
    expect(screen.getAllByText(/Expected Outcome/i).length).toBeGreaterThan(0);
  });

  it('has governance contract set', () => {
    const { container } = renderEXE02();
    expect(container.querySelector('.mission-govern-badge')).not.toBeNull();
  });
});
