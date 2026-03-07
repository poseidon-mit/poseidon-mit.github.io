import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider } from '../router'
import GovernAuditPage from '../pages/GovernAuditLedger'

// Partial GOV02 proxy — covers heading + engine-record assertions only.
// Does NOT reproduce the full GOV02 set: footer[aria-label="Governance verification footer"]
// is omitted because infra-integrity.test.ts:147 forbids GovernFooter import in app-route pages;
// the footer is layout-owned and absent in RouterProvider-only render.

function renderPage() {
  window.history.pushState({}, '', '/govern/audit')
  return render(
    <RouterProvider>
      <GovernAuditPage />
    </RouterProvider>,
  )
}

describe('GovernAuditLedger isolated contract (GOV02 partial)', () => {
  it('renders "Audit ledger" heading text', () => {
    renderPage()
    expect(screen.getAllByText(/Audit [Ll]edger/i).length).toBeGreaterThan(0)
  })

  it('shows engine type "protect" in audit records', () => {
    renderPage()
    expect(screen.getAllByText(/protect/i).length).toBeGreaterThan(0)
  })
})
