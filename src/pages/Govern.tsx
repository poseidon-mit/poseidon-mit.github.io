import { useMemo } from 'react'
import { GovernHero } from '@/components/poseidon/govern-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { selectGovernHeroView } from '@/domain/poseidon-universe'

export default function GovernPage() {
  usePageTitle('Govern')

  const heroView = useMemo(() => selectGovernHeroView(), [])

  return (
    <div className="hero-viewport">
      <GovernHero {...heroView} />
    </div>
  )
}
