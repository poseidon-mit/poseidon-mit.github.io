import { useMemo } from 'react'
import { ExecuteHero } from '@/components/poseidon/execute-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import { useDemoExecute } from '@/lib/demo-state/provider'
import {
  selectExecuteHeroView,
} from '@/domain/poseidon-universe'

export default function ExecutePage() {
  usePageTitle('Execute')
  const router = useRouter()
  const executeState = useDemoExecute()

  const heroView = useMemo(
    () => selectExecuteHeroView(executeState.actionStates),
    [executeState.actionStates],
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
