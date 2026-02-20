import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useRouter } from '@/router'
import { Eye, EyeOff } from 'lucide-react'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { AuthShell } from '@/components/layout/AuthShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button } from '@/design-system'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useToast } from '@/hooks/useToast'
import { useDemoState } from '@/lib/demo-state/provider'
import { DEMO_USER } from '@/lib/demo-user'
import { usePageTitle } from '@/hooks/use-page-title'

interface LoginFormValues {
  email: string
  password: string
}

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
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: DEMO_USER.email,
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSsoSubmitting, setIsSsoSubmitting] = useState<'google' | 'apple' | null>(null)
  const { navigate, search } = useRouter()
  const { showToast } = useToast()
  const { beginDemoSession } = useDemoState()

  const nextPath = useMemo(() => resolveNextPath(search), [search])

  const { errors, validate, clearFieldError, getFieldA11yProps, hasErrors } = useFormValidation<LoginFormValues>({
    email: {
      required: 'Email is required.',
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
    },
    password: {
      required: 'Password is required.',
      minLength: { value: 8, message: 'Password must be at least 8 characters.' },
    },
  })

  const startSessionAndNavigate = (method: 'skip' | 'form' | 'google' | 'apple', email?: string) => {
    beginDemoSession({ method, email })
    showToast({
      variant: 'success',
      message:
        method === 'skip'
          ? 'Demo mode started. Redirecting to dashboard.'
          : `Signed in (${method}) in demo mode.`,
    })
    navigate(nextPath)
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
    startSessionAndNavigate('form', formValues.email)
  }

  const handleSso = async (provider: 'google' | 'apple') => {
    setIsSsoSubmitting(provider)
    await wait(600)
    setIsSsoSubmitting(null)
    startSessionAndNavigate(provider, DEMO_USER.email)
  }

  return (
    <>
      <PublicTopBar />
      <AuthShell title="Access" subtitle="Welcome back">
        <main id="main-content">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="mb-4">
              <Button
                type="button"
                onClick={() => startSessionAndNavigate('skip', DEMO_USER.email)}
                variant="primary"
                engine="dashboard"
                fullWidth
                className="rounded-xl"
              >
                Continue in Demo Mode
              </Button>
              <p className="mt-2 text-xs text-slate-400">
                Demo mode uses simulated data. No real financial credentials are required.
              </p>
            </motion.div>

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
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => {
                    setFormValues((prev) => ({ ...prev, email: event.target.value }))
                    clearFieldError('email')
                  }}
                  placeholder={DEMO_USER.email}
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
                <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
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

              <motion.div variants={fadeUp} className="flex items-center justify-between">
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.currentTarget.checked)}
                    className="sr-only"
                    aria-label="Remember me"
                  />
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                      rememberMe
                        ? 'border-[var(--engine-dashboard)] bg-[var(--engine-dashboard)] text-slate-950'
                        : 'border-white/20 bg-white/[0.04] text-transparent'
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Remember me
                </label>
                <Link to="/recovery" className="text-xs font-medium text-[var(--engine-dashboard)] hover:text-cyan-200">
                  Forgot password?
                </Link>
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
                  Sign in
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="min-h-[20px]" aria-live="polite">
                {hasErrors ? <p className="text-xs text-red-400">Please resolve all form errors to continue.</p> : null}
              </motion.div>
            </motion.form>

            <motion.p variants={fadeUp} className="mt-5 text-center text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-[var(--engine-dashboard)] hover:text-cyan-200">
                Create one
              </Link>
            </motion.p>
          </motion.div>
        </main>
      </AuthShell>
    </>
  )
}
