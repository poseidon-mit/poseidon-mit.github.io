# Talk To Money Component Source Audit

**Status**: PHASE -1 COMPLETE — FAB truthful, "Coming Soon" removed, route awareness verified.

## 1. Current State (Post Phase -1)

**Location:** `src/components/ui/TalkToMoneyFab.tsx`

**Behavior:**
- FAB rendered by `AppNavShell.tsx` (line 116) on all authenticated routes
- Always interactive — no disabled state, no "Coming Soon" fallback (removed in Phase -1)
- Route-aware via `useRouter()` — reads current path for context
- On `/govern/audit-detail`, reads `decision` query param to provide audit context
- Opens inline conversation panel on click (`isOpen` toggle)
- Dynamic `aria-label` based on whether context is available

## 2. To Be Reused

- Route-aware activation pattern (reading path + query params via `useRouter()`)
- `AUDIT_DECISIONS` binding for govern audit context
- FAB positioning and z-index layering (avoids nav obstruction)
- Consumer-safe copy and aria-labels
- `ROUTE_TO_DECISION` mapping (added in Phase -1) provides the binding foundation

## 3. To Be Deleted / Replaced

- The floating action button mounting behavior → becomes Desktop Panel / Mobile Sheet
- Current inline panel toggle → replaced by state machine transitions
- Single-route context (govern audit only) → expanded to all flagship routes

## 4. State Machine Map (Target Contract)

| State | Trigger | UI | Notes |
|-------|---------|-----|-------|
| **Idle / Launch** | Default on all flagship routes | FAB visible, pulsing if context available | Context derived from `ROUTE_TO_DECISION` + route query params |
| **Response** | User sends message | Streaming text response in panel | Must show typing indicator during stream |
| **Desktop Panel** | Response received (>768px) | Side-anchored panel, does not obscure main content | Not a floating overlay |
| **Mobile Sheet** | Response received (<=768px) | Bottom sheet with drag-to-dismiss | Not a floating chip |
| **Unsupported** | Route has no context binding | FAB visible, shows "no context" message on click | Graceful degradation, never disabled |
| **Follow-up** | User sends follow-up | Continues conversation with accumulated context | Preserves prior turns |

## 5. Migration Plan

1. Host routes (Dashboard, Protect, Grow, Execute, Govern) must be stable first
2. Create `src/features/talk-to-money/` directory
3. Move FAB component and extract state machine
4. Wire route-native context injection per flagship route
5. Update `AppNavShell.tsx` to import from new location
6. **Path rule**: `src/features/talk-to-money/` must NOT appear in any import, test, or script until the directory physically exists and the file has been moved

## 6. Dependencies

- Shell/auth rewrite must complete first (AppNavShell layout changes)
- Flagship route rewrite must complete first (stable host surfaces)
- Separate plan required before implementation begins
