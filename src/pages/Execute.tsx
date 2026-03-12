import { useMemo } from 'react'
import { ExecuteHero } from '@/components/poseidon/execute-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import { useDemoState } from '@/lib/demo-state/provider'
import {
  selectArchitecturalTrust,
  selectExecuteHeroView,
} from '@/domain/poseidon-universe'

export default function ExecutePage() {
  usePageTitle('Execute')
  const router = useRouter()
  const { state } = useDemoState()

  const trust = useMemo(() => selectArchitecturalTrust(), [])
  const heroView = useMemo(
    () => selectExecuteHeroView(state.execute.actionStates),
    [state.execute.actionStates],
  )

  return (
    <div className="hero-viewport">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/45">
        <span className="rounded-full border border-white/10 px-3 py-1 uppercase tracking-[0.18em]">
          Human authorization required
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 uppercase tracking-[0.18em]">
          {trust.autoExecutionsWithoutConsent} auto-executions without consent
        </span>
      </div>

      <ExecuteHero
        {...heroView}
        onReviewApproval={
          heroView.featuredAction
            ? () => router.navigate(`/execute/approval?actionId=${heroView.featuredAction?.id}`)
            : null
        }
      />
    </div>
  )
}
