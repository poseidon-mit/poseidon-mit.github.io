import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from '@/router'
import { Fingerprint, ArrowRight, Loader2 } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { AuthShell } from '@/components/layout/AuthShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { useDemoState } from '@/lib/demo-state/provider'
import { DEMO_USER } from '@/lib/demo-user'
import { usePageTitle } from '@/hooks/use-page-title'

export default function SignupPage() {
  usePageTitle('Sign Up')
  const { navigate } = useRouter()
  const { beginDemoSession, updateOnboarding } = useDemoState()

  const [scanning, setScanning] = useState(false)

  const handlePasskey = useCallback(() => {
    setScanning(true)
    setTimeout(() => {
      beginDemoSession({ method: 'passkey', email: DEMO_USER.email, entryIntent: 'agentic' })
      updateOnboarding({ completed: false, completedAt: null })
      navigate('/')
    }, 800)
  }, [beginDemoSession, updateOnboarding, navigate])

  const handleSocial = useCallback((method: 'google' | 'apple') => {
    beginDemoSession({ method, email: DEMO_USER.email, entryIntent: 'agentic' })
    updateOnboarding({ completed: false, completedAt: null })
    navigate('/')
  }, [beginDemoSession, updateOnboarding, navigate])

  const handleSkip = useCallback(() => {
    beginDemoSession({ method: 'skip', email: DEMO_USER.email, entryIntent: 'express' })
    navigate('/dashboard')
  }, [beginDemoSession, navigate])

  return (
    <>
      <PublicTopBar />
      <AuthShell
        title=""
        subtitle="Create your profile"
        hideLogo
      >
        <div>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col">

            {/* Passkey — primary */}
            <motion.div variants={fadeUp} className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <Fingerprint size={32} className={`text-cyan-400 ${scanning ? 'animate-pulse' : ''}`} />
              </div>
              <button
                type="button"
                onClick={handlePasskey}
                disabled={scanning}
                data-cta-priority="primary"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 min-h-[44px] text-sm font-semibold text-white hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Continue with Passkey'
                )}
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Demo simulation — no real credentials stored
              </p>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/40 uppercase tracking-wider">other sign-up options</span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* Social Sign Up */}
            <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocial('google')}
                className="flex items-center justify-center gap-3 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors min-h-[44px]"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>
              <button
                type="button"
                onClick={() => handleSocial('apple')}
                className="flex items-center justify-center gap-3 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors min-h-[44px]"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.71 14.12c-.74 1.1-1.54 2.19-2.76 2.21-1.21.02-1.6-.72-2.98-.72s-1.81.7-2.96.74c-1.18.04-2.09-1.19-2.84-2.28C.62 11.72-.6 7.93.89 5.35A4.35 4.35 0 0 1 4.6 3.07c1.17-.02 2.27.79 2.98.79.72 0 2.06-.97 3.47-.83.59.02 2.24.24 3.3 1.8-.09.05-1.97 1.15-1.95 3.44.02 2.73 2.4 3.64 2.42 3.65-.02.06-.38 1.3-1.25 2.57l.14-.37ZM10.87 1.88c.59-.72 1.57-1.25 2.39-1.29.1 1.06-.31 2.12-.88 2.88-.56.76-1.48 1.35-2.39 1.27-.12-1.03.36-2.12.88-2.86Z" fill="currentColor"/>
                </svg>
                Sign up with Apple
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/55 hover:text-white transition-colors"
              >
                Try the demo instantly
                <ArrowRight size={14} />
              </button>
            </motion.div>

            <motion.p variants={fadeUp} className="text-center text-xs text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-emerald-400 hover:underline">Sign in</a>
            </motion.p>

          </motion.div>
        </div>
      </AuthShell>
    </>
  )
}
