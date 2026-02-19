import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouterProvider } from '../../router';
import SettingsRights from '../../pages/SettingsRights';

/**
 * Rights exercise flow: SET04 export/delete.
 * Critical rule: Delete operations require "DELETE" typed confirmation.
 */
describe('Settings rights exercise flow (SET04)', () => {
  function renderSET04() {
    return render(
      <RouterProvider>
        <SettingsRights />
      </RouterProvider>,
    );
  }

  it('renders consent scope section', () => {
    renderSET04();
    expect(screen.getByText(/Data consent scopes/i)).toBeInTheDocument();
  });

  it('has export buttons', () => {
    renderSET04();
    expect(screen.getByText(/Export as JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/Export as CSV/i)).toBeInTheDocument();
  });

  it('has delete section', () => {
    renderSET04();
    expect(
      screen.getByRole('heading', { name: /Delete my data/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it('delete button requires DELETE confirmation', () => {
    renderSET04();

    const deleteInput = screen.getByPlaceholderText(/Type DELETE/i);
    expect(deleteInput).toBeInTheDocument();

    // Initially disabled
    const confirmBtn = screen.getByText(/Type DELETE above to confirm/i);
    expect(confirmBtn.closest('button')).toBeDisabled();

    // Type incorrect text
    fireEvent.change(deleteInput, { target: { value: 'NOPE' } });
    expect(screen.getByText(/Type DELETE above to confirm/i).closest('button')).toBeDisabled();

    // Type correct text
    fireEvent.change(deleteInput, { target: { value: 'DELETE' } });
    expect(screen.getByText(/Permanently delete all data/i).closest('button')).not.toBeDisabled();
  });

  it('has governance contract set', () => {
    const { container } = renderSET04();
    expect(container.querySelector('.mission-govern-badge')).not.toBeNull();
  });
});
