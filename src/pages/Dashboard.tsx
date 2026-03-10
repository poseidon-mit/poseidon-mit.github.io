import { DashboardHeader } from '@/components/dashboard-v2/DashboardHeader'
import { NetWorthCard } from '@/components/dashboard-v2/NetWorthCard'
import { EngineStatusGrid } from '@/components/dashboard-v2/EngineStatusGrid'
import { RecentActivityFeed } from '@/components/dashboard-v2/RecentActivityFeed'
import { QuickActions } from '@/components/dashboard-v2/QuickActions'
import { MobileBottomNav } from '@/components/dashboard-v2/MobileBottomNav'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20 md:pb-8">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        <NetWorthCard />
        <EngineStatusGrid />
        <QuickActions />
        <RecentActivityFeed />
      </main>
      <MobileBottomNav />
    </div>
  )
}
