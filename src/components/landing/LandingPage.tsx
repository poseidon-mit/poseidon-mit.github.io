import { PublicTopBar } from "./PublicTopBar"
import { HeroSection } from "./HeroSection"
import { MetricsStrip } from "./MetricsStrip"
import { EngineCards } from "./EngineCards"
import { GovernanceProofSection } from "./GovernanceProofSection"
import { Footer } from "./Footer"

export function LandingPage() {
  return (
    <>
      <PublicTopBar />

      <div className="flex flex-col gap-20 pb-8 md:gap-28">
        <HeroSection />
        <MetricsStrip />
        <EngineCards />
        <GovernanceProofSection />
      </div>

      <Footer />
    </>
  )
}
