import { motion } from 'framer-motion'
import { getMotionPreset } from '@/lib/motion-presets'
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from '@/lib/page-layout'
import { usePageTitle } from '@/hooks/use-page-title'
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { useRouter } from '@/router'
import { SettingsLayout } from '@/components/settings/SettingsLayout'
import { SettingsControlCenter } from '@/components/poseidon/settings-hero'
import { useDemoState } from '@/lib/demo-state/provider'

// Static imports — all content loads in one chunk for instant tab switching
import { SettingsAIContent } from './SettingsAI'
import { SettingsIntegrationsContent } from './SettingsIntegrations'
import { SettingsRightsContent } from './SettingsRights'

const PAGE_TITLES: Record<string, string> = {
  '/settings': 'Settings',
  '/settings/ai': 'AI Preferences',
  '/settings/integrations': 'Integrations',
  '/settings/rights': 'Rights & Privacy',
}

export default function SettingsPage() {
  const { path } = useRouter()
  const currentPath = path.startsWith('/settings') ? path : '/settings'
  usePageTitle(PAGE_TITLES[currentPath] ?? 'Settings')
  const prefersReducedMotion = useReducedMotionSafe()
  const { staggerContainer: staggerContainerVariant } = getMotionPreset(prefersReducedMotion)
  const { state } = useDemoState()

  // Root /settings → hero-only
  if (currentPath === '/settings') {
    return (
      <div className="hero-viewport">
        <SettingsControlCenter
          userName={state.user.name}
          userInitials={state.user.name.split(' ').map((n) => n[0]).join('')}
          userEmail={state.user.email}
          memberSince="January 2024"
          connectedAccounts={4}
          twoFactorEnabled={true}
          aiMode="Assisted"
          notificationCategories={4}
          activeSessions={1}
          linkedDataSources={['Chase', 'Amex', 'Fidelity']}
          decisionsAnalyzed={847}
          lastLogin="2h ago"
          plan="Premium"
          lastPasswordChange="45 days ago"
          recoveryEmail="s***@gmail.com"
        />
      </div>
    )
  }

  // Sub-routes keep existing layout
  return (
    <SettingsLayout currentPath={currentPath}>
      <motion.main
        key={currentPath}
        id="main-content"
        role="main"
        className={`${PAGE_CONTENT_CLASS} command-center__main`}
        style={PAGE_CONTENT_STYLE}
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariant}
      >
        {currentPath === '/settings/ai' && <SettingsAIContent />}
        {currentPath === '/settings/integrations' && <SettingsIntegrationsContent />}
        {currentPath === '/settings/rights' && <SettingsRightsContent />}
      </motion.main>
    </SettingsLayout>
  )
}
