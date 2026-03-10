import { NetWorthCard } from '@/components/dashboard-v2/NetWorthCard'
import { EngineStatusGrid } from '@/components/dashboard-v2/EngineStatusGrid'
import { RecentActivityFeed } from '@/components/dashboard-v2/RecentActivityFeed'
import { QuickActions } from '@/components/dashboard-v2/QuickActions'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'

export default function Dashboard() {
  return (
    <div
      id="main-content"
      role="main"
      className={`${PAGE_CONTENT_CLASS} flex flex-col gap-6`}
      style={PAGE_CONTENT_STYLE}
    >
      <NetWorthCard />
      <EngineStatusGrid />
      <QuickActions />
      <RecentActivityFeed />
    </div>
  )
}
