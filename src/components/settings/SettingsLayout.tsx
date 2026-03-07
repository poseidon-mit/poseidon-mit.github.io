import { cn } from '@/lib/utils'
import { useRouter } from '@/router'

const SETTINGS_TABS = [
  { label: 'General', path: '/settings' },
  { label: 'AI', path: '/settings/ai' },
  { label: 'Integrations', path: '/settings/integrations' },
  { label: 'Rights', path: '/settings/rights' },
] as const

export function SettingsLayout({
  currentPath,
  children,
}: {
  currentPath: string
  children: React.ReactNode
}) {
  const { navigate } = useRouter()

  return (
    <div>
      {/* Tab navigation */}
      <div className="border-b border-white/[0.06] mb-6">
        <nav className="flex overflow-x-auto gap-1 px-4 md:px-6 lg:px-8" aria-label="Settings navigation">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={cn(
                'shrink-0 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors cursor-pointer whitespace-nowrap',
                currentPath === tab.path
                  ? 'border-[var(--engine-execute)] text-white'
                  : 'border-transparent text-white/50 hover:text-white/80'
              )}
              aria-current={currentPath === tab.path ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}
