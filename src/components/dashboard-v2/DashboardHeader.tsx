import { Bell } from 'lucide-react'
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
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-zinc-200 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[#0A1628]">
            {greeting}, {MOCK_USER.name}
          </h1>
          <p className="text-sm text-zinc-500">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-600" />
          </button>
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
            <span className="text-sm font-medium text-zinc-600">
              {MOCK_USER.initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
