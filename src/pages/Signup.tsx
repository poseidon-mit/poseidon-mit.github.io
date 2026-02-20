import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useRouter } from '@/router'
import { Eye, EyeOff, Check } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { AuthShell } from '@/components/layout/AuthShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button } from '@/design-system'
import { useFormValidation } from '@/hooks/useFormValidation'
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

interface SignupFormValues {
  fullName: string
  email: string
  password: string
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export default function SignupPage() {
  usePageTitle('Create account')
  const [showPass, setShowPass] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSsoSubmitting, setIsSsoSubmitting] = useState<'google' | 'apple' | null>(null)
  const [formValues, setFormValues] = useState<SignupFormValues>({
    fullName: DEMO_USER.name,
    email: DEMO_USER.email,
    password: '',
  })

  const { navigate } = useRouter()
  const { showToast } = useToast()
  const { beginDemoSession, updateOnboarding } = useDemoState()

  const { errors, validate, clearFieldError, getFieldA11yProps, hasErrors } = useFormValidation<SignupFormValues>({
    fullName: {
      required: 'Full name is required.',
      minLength: { value: 2, message: 'Full name must be at least 2 characters.' },
    },
    email: {
      required: 'Email is required.',
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
    },
    password: {
      required: 'Password is required.',
      minLength: { value: 8, message: 'Password must be at least 8 characters.' },
    },
  })

  const beginSignupFlow = (method: 'skip' | 'form' | 'google' | 'apple', email: string) => {
    beginDemoSession({ method, email })
    updateOnboarding({ completed: false, completedAt: null })
    showToast({
      variant: 'success',
      message:
        method === 'skip'
          ? 'Demo onboarding started. Continue to account connection.'
          : 'Account setup started in demo mode.',
    })
    navigate('/onboarding/connect')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate(formValues)) {
      showToast({ variant: 'error', message: 'Please fix validation errors before continuing.' })
      return
    }

    setIsSubmitting(true)
    await wait(700)
    setIsSubmitting(false)
    beginSignupFlow('form', formValues.email)
  }

  const handleSso = async (provider: 'google' | 'apple') => {
    setIsSsoSubmitting(provider)
    await wait(600)
    setIsSsoSubmitting(null)
    beginSignupFlow(provider, DEMO_USER.email)
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
                onClick={() => beginSignupFlow('skip', DEMO_USER.email)}
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

            <motion.div variants={fadeUp} className="space-y-3">
              <Button
                type="button"
                onClick={() => handleSso('google')}
                loading={isSsoSubmitting === 'google'}
                variant="outline"
                fullWidth
                className="justify-center gap-2 rounded-xl border-white/80 bg-white text-slate-900 hover:bg-white/90"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                onClick={() => handleSso('apple')}
                loading={isSsoSubmitting === 'apple'}
                variant="outline"
                fullWidth
                className="justify-center gap-2 rounded-xl border-white/80 bg-white text-slate-900 hover:bg-white/90"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-400">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </motion.div>

            <motion.form variants={staggerContainer} className="space-y-4" onSubmit={handleSubmit} noValidate>
              <motion.div variants={fadeUp}>
                <label htmlFor="signup-full-name" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  Full name
                </label>
                <input
                  id="signup-full-name"
                  name="fullName"
                  type="text"
                  value={formValues.fullName}
                  onChange={(event) => {
                    setFormValues((prev) => ({ ...prev, fullName: event.target.value }))
                    clearFieldError('fullName')
                  }}
                  placeholder="Alex Chen"
                  className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-[var(--engine-dashboard)]/45"
                  {...getFieldA11yProps('fullName')}
                />
                {errors.fullName ? (
                  <p id="fullName-error" className="mt-1 text-xs text-red-400" role="alert">
                    {errors.fullName}
                  </p>
                ) : null}
              </motion.div>

              <motion.div variants={fadeUp}>
                <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => {
                    setFormValues((prev) => ({ ...prev, email: event.target.value }))
                    clearFieldError('email')
                  }}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-[var(--engine-dashboard)]/45"
                  {...getFieldA11yProps('email')}
                />
                {errors.email ? (
                  <p id="email-error" className="mt-1 text-xs text-red-400" role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </motion.div>

              <motion.div variants={fadeUp}>
                <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={(event) => {
                      setFormValues((prev) => ({ ...prev, password: event.target.value }))
                      clearFieldError('password')
                    }}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 pr-10 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-[var(--engine-dashboard)]/45"
                    {...getFieldA11yProps('password')}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    variant="ghost"
                    size="sm"
                    engine="dashboard"
                    className="absolute right-2 top-1/2 -translate-y-1/2 !h-8 !min-h-8 !w-8 !px-0 text-slate-500 hover:text-slate-300"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password ? (
                  <p id="password-error" className="mt-1 text-xs text-red-400" role="alert">
                    {errors.password}
                  </p>
                ) : null}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button
                  type="submit"
                  variant="primary"
                  engine="dashboard"
                  fullWidth
                  loading={isSubmitting}
                  className="rounded-xl"
                >
                  Continue onboarding
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="min-h-[20px]" aria-live="polite">
                {hasErrors ? <p className="text-xs text-red-400">Please resolve all form errors to continue.</p> : null}
              </motion.div>
            </motion.form>

            <motion.p variants={fadeUp} className="mt-5 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[var(--engine-dashboard)] hover:text-cyan-200">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </main>
      </AuthShell>
    </>
  )
}
