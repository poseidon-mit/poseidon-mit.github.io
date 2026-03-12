import { useMemo } from 'react'
import { ExecuteHero } from '@/components/poseidon/execute-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import { useDemoState } from '@/lib/demo-state/provider'
import {
  selectExecuteHeroView,
} from '@/domain/poseidon-universe'

export default function ExecutePage() {
  usePageTitle('Execute')
  const router = useRouter()
  const { state } = useDemoState()

  const heroView = useMemo(
    () => selectExecuteHeroView(state.execute.actionStates),
    [state.execute.actionStates],
  )

  return (
    <div className="hero-viewport">
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
