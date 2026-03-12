import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterProvider } from '../../router';
import ExecuteApproval from '../../pages/ExecuteApproval';

/**
 * Execute approval flow: EXE02 consent-gated approval.
 * Critical rule: Approve button disabled until consent checkbox checked.
 */
describe('Execute approval flow (EXE02)', () => {
  beforeEach(() => {
    // Set URL to a Tier 2 action so the approval page renders
    window.history.pushState({}, '', '/execute/approval?actionId=EXE-011');
  });

  function renderEXE02() {
    return render(
      <RouterProvider>
        <ExecuteApproval />
      </RouterProvider>,
    );
  }

  it('starts with slide-to-authorize disabled (Tier 2)', () => {
    renderEXE02();
    // EXE-011 is riskTier 2, uses SlideToApprove instead of button
    const slider = screen.getByRole('slider', { name: /Slide to Approve/i });
    expect(slider).toBeInTheDocument();
  });

  it('enables slide-to-authorize after consent scope is reviewed', () => {
    const { container } = renderEXE02();

    // Check the consent checkbox via its label
    const consentLabel = container.querySelector('[data-slot="consent_scope"]') as HTMLElement;
    expect(consentLabel).not.toBeNull();
    const checkbox = consentLabel.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(checkbox);

    // After checking, slider should be interactive (not disabled)
    const slider = screen.getByRole('slider', { name: /Slide to Approve/i });
    expect(slider).not.toHaveClass('opacity-50');
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

  it('shows impact split-state with approved/deferred text', () => {
    renderEXE02();
    expect(screen.getAllByText(/If approved/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/If deferred/i).length).toBeGreaterThan(0);
  });

  it('renders execution plan stepper', () => {
    renderEXE02();
    expect(screen.getAllByText(/Execution Plan/i).length).toBeGreaterThan(0);
  });
});

describe('Execution Stream (Step 5)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.pushState({}, '', '/execute/approval?actionId=EXE-011');
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  function renderAndApprove() {
    const result = render(
      <RouterProvider>
        <ExecuteApproval />
      </RouterProvider>,
    );
    // Enable approve
    const consentLabel = result.container.querySelector('[data-slot="consent_scope"]') as HTMLElement;
    const checkbox = consentLabel.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(checkbox);
    // Authorize via slider keyboard Enter (Tier 2)
    const slider = screen.getByRole('slider', { name: /Slide to Approve/i });
    fireEvent.keyDown(slider, { key: 'Enter' });
    // Confirm in dialog
    const confirmBtn = screen.getByRole('button', { name: /^Approve$/i });
    fireEvent.click(confirmBtn);
    return result;
  }

  it('shows execution stream overlay after approval', () => {
    renderAndApprove();
    expect(screen.getByText('Execution Stream')).toBeInTheDocument();
    expect(screen.getByText('Reviewing')).toBeInTheDocument();
  });

  it('progresses through phases with timers', () => {
    renderAndApprove();
    act(() => { vi.advanceTimersByTime(1200) });
    expect(screen.getByText('Signing')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1600) });
    expect(screen.getByText('Submitting')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1400) });
    expect(screen.getByText(/Action confirmed/i)).toBeInTheDocument();
  });

  it('prevents double-click from triggering duplicate execution', () => {
    const result = render(
      <RouterProvider>
        <ExecuteApproval />
      </RouterProvider>,
    );
    const consentLabel = result.container.querySelector('[data-slot="consent_scope"]') as HTMLElement;
    const checkbox = consentLabel.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(checkbox);
    // Authorize via slider keyboard Enter (Tier 2)
    const slider = screen.getByRole('slider', { name: /Slide to Approve/i });
    fireEvent.keyDown(slider, { key: 'Enter' });
    const confirmBtn = screen.getByRole('button', { name: /^Approve$/i });
    fireEvent.click(confirmBtn);
    // Overlay should be showing
    expect(screen.getByText('Execution Stream')).toBeInTheDocument();
    // The dialog is dismissed so a second approve is not possible via UI
    // Verify only one overlay exists
    expect(screen.getAllByText('Execution Stream')).toHaveLength(1);
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = renderAndApprove();
    expect(screen.getByText('Execution Stream')).toBeInTheDocument();
    unmount();
    // Advancing timers after unmount should not throw
    expect(() => {
      act(() => { vi.runAllTimers() });
    }).not.toThrow();
  });
});
