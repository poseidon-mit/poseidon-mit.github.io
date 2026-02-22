/**
 * Governance metadata for all App Shell routes.
 *
 * Single source of truth for GovernFooter props, AuroraPulse color,
 * and engine association per route. Keeps per-page boilerplate minimal.
 */
import { ROUTE_META_CONTRACT } from '@/contracts/rebuild-contracts'
import type { EngineName } from './engine-tokens'
import { engineTokens } from './engine-tokens'

export interface GovernanceMeta {
  auditId: string
  pageContext: string
  engine: EngineName
  auroraColor: string
  showFooter: boolean
}

/**
 * Governance metadata keyed by route path.
 * Derived from the route meta contract to avoid split source-of-truth drift.
 */
export const GOVERNANCE_META: Record<string, GovernanceMeta> = Object.fromEntries(
  Object.values(ROUTE_META_CONTRACT)
    .filter((meta) => Boolean(meta.governance))
    .map((meta) => {
      const governance = meta.governance!;
      return [
        meta.route,
        {
          auditId: governance.auditId,
          pageContext: governance.pageContext,
          engine: governance.engine,
          auroraColor: engineTokens[governance.engine].color,
          showFooter: governance.showFooter !== false,
        } satisfies GovernanceMeta,
      ];
    }),
)

/** Get governance metadata for a route, with fallback for unknown routes. */
export function getGovernanceMeta(path: string): GovernanceMeta | undefined {
  return GOVERNANCE_META[path]
}
