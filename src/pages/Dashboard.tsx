import { useMemo } from 'react'
import { DashboardHero } from '@/components/poseidon/dashboard-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import { useDemoExecute } from '@/lib/demo-state/provider'
import {
  selectDashboardHeroView,
} from '@/domain/poseidon-universe'

export default function Dashboard() {
  usePageTitle('Dashboard')
  const router = useRouter()
  const executeState = useDemoExecute()

  const heroView = useMemo(
    () => selectDashboardHeroView(executeState.actionStates),
    [executeState.actionStates],
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
