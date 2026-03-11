import LandingHeader from '@/components/landing-v2/LandingHeader'
import HeroSection from '@/components/landing-v2/HeroSection'
import DashboardPreview from '@/components/landing-v2/DashboardPreview'
import { LandingFooter } from '@/components/landing-v2/CTAFooter'

export default function Landing() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <div className="h-16 bg-gradient-to-b from-slate-950 to-[#F8F7F4]" />
      <DashboardPreview />
      <LandingFooter />
    </div>
  )
}
