import { useMemo } from 'react'
import { DashboardHero } from '@/components/poseidon/dashboard-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import { useDemoState } from '@/lib/demo-state/provider'
import {
  selectDashboardHeroView,
} from '@/domain/poseidon-universe'

export default function Dashboard() {
  usePageTitle('Dashboard')
  const router = useRouter()
  const { state } = useDemoState()

  const heroView = useMemo(
    () => selectDashboardHeroView(state.execute.actionStates),
    [state.execute.actionStates],
  )

  return (
    <div className="hero-viewport">
      <DashboardHero
        userName="Shinji"
        {...heroView}
        onNavigate={(path) => router.navigate(path)}
      />
    </div>
  )
}
