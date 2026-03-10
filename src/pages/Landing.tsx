import { useState, useCallback } from 'react'
import HeroSection from '@/components/landing-v2/HeroSection'
import SocialProofBar from '@/components/landing-v2/SocialProofBar'
import EngineShowcase from '@/components/landing-v2/EngineShowcase'
import HowItWorks from '@/components/landing-v2/HowItWorks'
import DashboardPreview from '@/components/landing-v2/DashboardPreview'
import TrustSecurity from '@/components/landing-v2/TrustSecurity'
import CTAFooter from '@/components/landing-v2/CTAFooter'
import { OnboardingSheet } from '@/components/landing-v2/OnboardingSheet'

export default function Landing() {
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const openOnboarding = useCallback(() => setOnboardingOpen(true), [])

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <HeroSection onGetStarted={openOnboarding} />
      <SocialProofBar />
      <EngineShowcase />
      <HowItWorks />
      <DashboardPreview />
      <TrustSecurity />
      <CTAFooter onGetStarted={openOnboarding} />
      <OnboardingSheet open={onboardingOpen} onDismiss={() => setOnboardingOpen(false)} />
    </div>
  )
}
