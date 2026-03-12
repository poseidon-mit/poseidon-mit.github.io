import { useMemo } from 'react'
import { GrowHero } from '@/components/poseidon/grow-hero'
import { usePageTitle } from '@/hooks/use-page-title'
import { useRouter } from '@/router'
import { selectGrowHeroView } from '@/domain/poseidon-universe'

export default function GrowPage() {
  usePageTitle('Grow')
  const router = useRouter()

  const heroView = useMemo(() => selectGrowHeroView(), [])

  return (
    <div className="hero-viewport">
      <GrowHero
        {...heroView}
        onViewRecommendations={() => router.navigate('/grow/recommendations')}
      />
    </div>
  )
}
