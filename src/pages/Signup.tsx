import { motion } from 'framer-motion'
import { useRouter } from '@/router'
import { Eye, Check } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { AuthShell } from '@/components/layout/AuthShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button } from '@/design-system'
import { useToast } from '@/hooks/useToast'
import { useDemoState } from '@/lib/demo-state/provider'
import { DEMO_USER } from '@/lib/demo-user'
import { usePageTitle } from '@/hooks/use-page-title'

const TRUST_POINTS = [
  'Bank-level encryption for all data',
  'Read-only access to financial accounts',
  'Every AI decision is explainable',
  'Full audit trail in the Govern engine',
  'Reverse any action at any time',
]


function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export default function SignupPage() {
  usePageTitle('Create account')
  const { navigate } = useRouter()
  const { showToast } = useToast()
  const { beginDemoSession, updateOnboarding } = useDemoState()

  const beginSignupFlow = (method: 'skip') => {
    beginDemoSession({ method, email: DEMO_USER.email })
    updateOnboarding({ completed: false, completedAt: null })
    showToast({
      variant: 'success',
      message: 'Demo onboarding started. Continue to account connection.',
    })
    navigate('/onboarding/connect')
  }

  return (
    <>
      <PublicTopBar />
      <AuthShell title="Onboarding" subtitle="Create your account">
        <main id="main-content">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="mb-4">
              <Button
                type="button"
                onClick={() => beginSignupFlow('skip')}
                variant="primary"
                engine="dashboard"
                fullWidth
                className="rounded-xl"
              >
                Continue in Demo Mode
              </Button>
              <p className="mt-2 text-xs text-slate-400">
                Demo mode skips real account creation and uses simulated financial data.
              </p>
            </motion.div>

            <motion.ul variants={staggerContainer} className="mb-6 space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              {TRUST_POINTS.map((point) => (
                <motion.li key={point} variants={fadeUp} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[var(--state-healthy)]" aria-hidden="true" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="space-y-6 pt-4">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <Eye className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-display font-medium text-white mb-2">Initialize Profile</h3>
                <p className="text-sm text-slate-400">Preparing workspace for {DEMO_USER.name}</p>
              </div>

              <Button
                type="button"
                onClick={() => beginSignupFlow('skip')}
                variant="primary"
                engine="dashboard"
                fullWidth
                className="rounded-full py-6 text-lg tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all"
              >
                Begin Setup Sequence
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </AuthShell>
    </>
  )
}
