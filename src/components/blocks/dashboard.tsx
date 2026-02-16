/**
 * Dashboard Block — Architecture B wrapper
 *
 * Composes the v0-generated command-center sub-components.
 * The visual layout is preserved exactly as v0 produced it;
 * this block exists to provide the Architecture B entry point
 * (blocks/ directory pattern) referenced by the page.
 */
import { HeroSection } from '@/components/dashboard/HeroSection'
import { KpiGrid } from '@/components/dashboard/KpiGrid'
import { EngineHealthStrip } from '@/components/dashboard/EngineHealthStrip'
import { PrimaryFeed } from '@/components/dashboard/PrimaryFeed'
import { DecisionRail } from '@/components/dashboard/DecisionRail'
import { GovernFooter } from '@/components/dashboard/GovernFooter'
import '@/styles/dashboard-command.css'

export function DashboardBlock() {
  return (
    <div className="command-center">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <main id="main-content" className="command-center__main">
        <HeroSection />
        <KpiGrid />
        <EngineHealthStrip />

        <div className="command-center__columns">
          <PrimaryFeed />
          <DecisionRail />
        </div>

        <GovernFooter />
      </main>
    </div>
  )
}

export default DashboardBlock
