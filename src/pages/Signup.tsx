import { motion } from 'framer-motion'
import { useRouter } from '@/router'
import { ShieldCheck, Check, Fingerprint, ArrowRight } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { AuthShell } from '@/components/layout/AuthShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button } from '@/design-system'
import { useToast } from '@/hooks/useToast'
import { useDemoState } from '@/lib/demo-state/provider'
import { DEMO_USER } from '@/lib/demo-user'
import { usePageTitle } from '@/hooks/use-page-title'

const TRUST_POINTS = [
  'Bank-level 256-bit encryption',
  'Read-only financial access',
  'Full AI audit trails & reversibility',
]

export default function SignupPage() {
  usePageTitle('Initialize Engine')
  const { navigate } = useRouter()
  const { showToast } = useToast()
  const { beginDemoSession, updateOnboarding } = useDemoState()

  const beginSignupFlow = () => {
    beginDemoSession({ method: 'skip', email: DEMO_USER.email })
    updateOnboarding({ completed: false, completedAt: null })
    showToast({
      variant: 'success',
      message: 'Profile initialized. Proceeding to secure connection.',
    })
    navigate('/onboarding')
  }

  return (
    <>
      <PublicTopBar />
      <AuthShell title="Initialization" subtitle="Create your secure wealth profile">
        <main id="main-content">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col h-full">

            <motion.div variants={fadeUp} className="text-center mb-8 mt-2">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <Fingerprint className="w-10 h-10 text-cyan-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-display font-medium text-white mb-2 tracking-wide">Initialize Profile</h3>
              <p className="text-sm text-slate-400 font-light">
                Securing a hyper-personalized autonomous engine for {DEMO_USER.name}.
              </p>
            </motion.div>

            <motion.ul variants={staggerContainer} className="mb-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">Security Guarantee</span>
              </div>
              {TRUST_POINTS.map((point) => (
                <motion.li key={point} variants={fadeUp} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="h-4 w-4 flex-shrink-0 text-emerald-400" aria-hidden="true" />
                  <span className="font-light">{point}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="pt-4 pb-4">
              <Button
                type="button"
                onClick={beginSignupFlow}
                variant="primary"
                engine="dashboard"
                fullWidth
                className="rounded-2xl py-5 text-lg font-bold shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-all flex justify-center items-center gap-2 border border-cyan-500/50"
              >
                Create Profile <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-center text-xs text-slate-500 mt-4 font-light">
                By initializing, you retain absolute control.<br />
                <span className="text-white/20 text-[10px] uppercase tracking-wider mt-2 block">(Demo Mode Simulation)</span>
              </p>
            </motion.div>

          </motion.div>
        </main>
      </AuthShell>
    </>
  )
}
