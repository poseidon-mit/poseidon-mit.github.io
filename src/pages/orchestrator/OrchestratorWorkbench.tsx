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

// ─── Hooks ──────────────────────────────────────────────────────────────────
import { useOrchestratorLifecycle } from '@/hooks/useOrchestratorLifecycle'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'

// ─── Internal Workbench Layout ───────────────────────────────────────────────

function WorkbenchInner() {
  const { state } = useWorkbenchContext()
  // OPFS persistence + auto-purge
  useOrchestratorLifecycle({
    persistEnabled: state.localFirstStatus.opfsAvailable,
    autoPurge: true,
  })

  return (
    <div id="main-content" role="main" className="flex flex-col h-screen overflow-hidden bg-black">
      {/* Context-Aware Intent Workspace (v4.0 primary interface) */}
      <IntentWorkspaceShell />
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
