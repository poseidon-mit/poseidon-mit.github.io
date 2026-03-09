import { useEffect } from 'react'
import { useRouter } from '../router'

export default function OnboardingRedirect() {
  const { navigate } = useRouter()
  useEffect(() => { navigate('/onboarding') }, [navigate])
  return null
}
