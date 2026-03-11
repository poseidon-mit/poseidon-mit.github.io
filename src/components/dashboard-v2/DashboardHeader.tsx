import { Bell } from 'lucide-react'
import { Link } from '@/router'
import { MOCK_USER } from '@/lib/mock-data'

export function DashboardHeader() {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-white/[0.06] px-4 py-3 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {greeting}, {MOCK_USER.name}
          </h1>
          <p className="text-sm text-muted-foreground">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/protect"
            className="relative p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              {MOCK_USER.initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
