"use client"

import { PublicTopBar } from "./PublicTopBar"
import { HeroSection } from "./HeroSection"
import { MetricsStrip } from "./MetricsStrip"
import { EngineCards } from "./EngineCards"
import { GovernanceProofSection } from "./GovernanceProofSection"
import { Footer } from "./Footer"

export function LandingPage() {
  return (
    <>
      {/* Skip link — a11y baseline */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-teal-500 focus:px-4 focus:py-2 focus:text-slate-950 focus:outline-none"
      >
        Skip to main content
      </a>

      <PublicTopBar />

      <main id="main-content" className="flex flex-col gap-20 pb-8 md:gap-28">
        <HeroSection />
        <MetricsStrip />
        <EngineCards />
        <GovernanceProofSection />
      </main>

      <Footer />
    </>
  )
}
