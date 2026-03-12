/**
 * Orchestrator Workbench v4.0 — Context-Aware Intent Workspace
 *
 * Primary interface is now a proactive, visual workspace — not a chat thread.
 * Chat becomes a collapsible secondary drawer accessible from the header.
 *
 * Architecture:
 * - WorkbenchProvider → AuditProvider → ApprovalProvider (nested contexts)
 * - IntentWorkspaceShell: suggestion bar + streaming bento grid + overlays
 * - ChatDrawer: collapsible wrapper around v3.0 ChatOrchestratorShell
 * - DecisionAutopsyDrawer: deterministic data lineage (right panel)
 * - ConfidenceHeatmapOverlay: floating confidence indicator
 * - useOrchestratorLifecycle: OPFS persistence, auto-purge
 */

// ─── Contexts ─────────────────────────────────────────────────────────────────
import { WorkbenchProvider } from '@/contexts/WorkbenchContext'
import { AuditProvider } from '@/contexts/AuditContext'
import { ApprovalProvider } from '@/contexts/ApprovalContext'

// ─── Workspace Shell (v4.0 — replaces ChatOrchestratorShell as primary) ─────
import { IntentWorkspaceShell } from '@/components/orchestrator/workspace/IntentWorkspaceShell'

// ─── Poseidon Facades ────────────────────────────────────────────────────────
import { GovernFooter, AuroraPulse } from '@/components/poseidon'
import { selectGovernFooterView } from '@/domain/poseidon-universe'

// ─── Hooks ──────────────────────────────────────────────────────────────────
import { useOrchestratorLifecycle } from '@/hooks/useOrchestratorLifecycle'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'

// ─── Internal Workbench Layout ───────────────────────────────────────────────

function WorkbenchInner() {
  const { state } = useWorkbenchContext()
  const isGovern = state.themeMode.mode === 'govern'
  const engineColor = isGovern ? 'var(--engine-govern)' : 'var(--engine-dashboard)'
  const auditId =
    selectGovernFooterView(isGovern ? 'govern' : undefined).latestEntries[0]?.id ?? 'AUD-891'

  // OPFS persistence + auto-purge
  useOrchestratorLifecycle({
    persistEnabled: state.localFirstStatus.opfsAvailable,
    autoPurge: true,
  })

  return (
    <div id="main-content" role="main" className="flex flex-col h-screen overflow-hidden bg-black">
      {/* Aurora Pulse */}
      <AuroraPulse color={engineColor} intensity="subtle" />

      {/* Context-Aware Intent Workspace (v4.0 primary interface) */}
      <IntentWorkspaceShell />

      {/* Govern Footer */}
      <GovernFooter
        auditId={auditId}
        pageContext="Orchestrator v4.0 — Context-Aware Intent Workspace"
      />
    </div>
  )
}

// ─── Exported Page Component ─────────────────────────────────────────────────

export default function OrchestratorWorkbench() {
  return (
    <WorkbenchProvider>
      <AuditProvider>
        <ApprovalProvider>
          <WorkbenchInner />
        </ApprovalProvider>
      </AuditProvider>
    </WorkbenchProvider>
  )
}
