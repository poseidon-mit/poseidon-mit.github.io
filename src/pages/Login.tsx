import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from '@/router'
import { Eye } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { AuthShell } from '@/components/layout/AuthShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button } from '@/design-system'
import { useToast } from '@/hooks/useToast'
import { useDemoState } from '@/lib/demo-state/provider'
import { DEMO_USER } from '@/lib/demo-user'
import { usePageTitle } from '@/hooks/use-page-title'

function resolveNextPath(search: string): string {
  const params = new URLSearchParams(search)
  const next = params.get('next')
  return next && next.startsWith('/') ? next : '/dashboard'
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export default function LoginPage() {
  usePageTitle('Sign in')

  const { navigate, search } = useRouter()
  const { showToast } = useToast()
  const { beginDemoSession } = useDemoState()

  const nextPath = useMemo(() => resolveNextPath(search), [search])

  const startSessionAndNavigate = (method: 'skip') => {
    beginDemoSession({ method, email: DEMO_USER.email })
    showToast({
      variant: 'success',
      message: 'Demo mode started. Redirecting to Command Center.',
    })
    navigate(nextPath)
  }

  return (
    <>
      <PublicTopBar />
      <AuthShell title="Access" subtitle="Welcome back">
        <motion.div variants={fadeUp} className="space-y-6 pt-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <Eye className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-display font-medium text-white mb-2">Biometric Verification</h3>
            <p className="text-sm text-slate-400">Scan initiated for {DEMO_USER.email}</p>
          </div>

          <Button
            type="button"
            onClick={() => startSessionAndNavigate('skip')}
            variant="primary"
            engine="dashboard"
            fullWidth
            className="rounded-full py-6 text-lg tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all"
          >
            Enter Command Center
          </Button>
        </motion.div>
      </AuthShell >
    </>
  )
}
