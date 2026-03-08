import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouterProvider } from '../../router';
import GovernTrust from '../../pages/Govern';
import GovernAuditLedger from '../../pages/GovernAuditLedger';
import GovernAuditDetail from '../../pages/GovernAuditDetail';

/**
 * Govern audit flow: GOV01 → GOV02 → GOV03.
 * Decision → Audit → Review chain.
 */
describe('Govern audit flow', () => {
  function renderWithRouter(Component: React.ComponentType) {
    return render(
      <RouterProvider>
        <Component />
      </RouterProvider>,
    );
  }

  describe('GOV01 - Govern Dashboard', () => {
    it('displays decisions audited headline', () => {
      renderWithRouter(GovernTrust);
      expect(screen.getAllByText(/Decisions Audited/i).length).toBeGreaterThan(0);
    });

    it('shows decision audit trail', () => {
      renderWithRouter(GovernTrust);
      expect(screen.getAllByText(/Decision Audit Trail/i).length).toBeGreaterThan(0);
    });

    // GovernFooter is injected by AuthenticatedLayout, not by the page component.
    // Footer coverage tested in govern-footer-integration.test.tsx.
  });

  describe('GOV02 - Audit Ledger', () => {
    it('renders audit records', () => {
      renderWithRouter(GovernAuditLedger);
      expect(screen.getAllByText(/Audit ledger/i).length).toBeGreaterThan(0);
    });

    it('shows engine type for records', () => {
      renderWithRouter(GovernAuditLedger);
      expect(screen.getAllByText(/protect/i).length).toBeGreaterThan(0);
    });

    // GovernFooter is injected by AuthenticatedLayout, not by the page component.
    // Footer coverage tested in govern-footer-integration.test.tsx.
  });

  describe('GOV03 - Audit Detail', () => {
    it('shows decision reconstruction', () => {
      renderWithRouter(GovernAuditDetail);
      expect(screen.getAllByText(/Decision reconstruction/i).length).toBeGreaterThan(0);
    });

    it('shows compliance flags', () => {
      renderWithRouter(GovernAuditDetail);
      expect(screen.getAllByText(/GDPR/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/ECOA/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/CCPA/i).length).toBeGreaterThan(0);
    });

    it('all compliance flags show compliant', () => {
      renderWithRouter(GovernAuditDetail);
      const compliantElements = screen.getAllByText(/Compliant/i);
      expect(compliantElements.length).toBe(3);
    });

    // GovernFooter is injected by AuthenticatedLayout, not by the page component.
    // Footer coverage tested in govern-footer-integration.test.tsx.
  });
});
