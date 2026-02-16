import { HeroSection } from '@/components/dashboard/HeroSection';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { EngineHealthStrip } from '@/components/dashboard/EngineHealthStrip';
import { PrimaryFeed } from '@/components/dashboard/PrimaryFeed';
import { DecisionRail } from '@/components/dashboard/DecisionRail';
import { GovernFooter } from '@/components/dashboard/GovernFooter';

export function Dashboard() {
  return (
    <div className="command-center">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
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
  );
}

export default Dashboard;
