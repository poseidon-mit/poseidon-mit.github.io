import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Mail, MailCheck, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from '@/router'
import { PublicTopBar } from '@/components/landing/PublicTopBar'
import { AuthShell } from '@/components/layout/AuthShell'
import { fadeUp, staggerContainer } from '@/lib/motion-presets'
import { Button } from '@/design-system'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useToast } from '@/hooks/useToast'
import { usePageTitle } from '@/hooks/use-page-title'

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function Recovery() {
  usePageTitle('Recovery')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const { showToast } = useToast()

  const { errors, validate, clearFieldError, getFieldA11yProps } = useFormValidation<{ email: string }>({
    email: {
      required: 'Email is required.',
      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
    },
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate({ email })) {
      showToast({ variant: 'error', message: 'Please enter a valid email address.' })
      return
    }

    setLoading(true)
    await wait(1200)
    setLoading(false)
    setStep(2)
    setCountdown(60)
    setCanResend(false)
    showToast({ variant: 'success', message: 'Reset link sent in demo mode.' })
  }

  const handleResend = async () => {
    setCanResend(false)
    setCountdown(60)
    await wait(400)
    showToast({ variant: 'info', message: 'Reset link re-sent.' })
  }

  useEffect(() => {
    if (step !== 2) return
    if (countdown <= 0) {
      setCanResend(true)
      return
    }

    const timeoutId = window.setTimeout(() => setCountdown((current) => current - 1), 1000)
    return () => window.clearTimeout(timeoutId)
  }, [step, countdown])

  return (
    <>
      <PublicTopBar />
      <AuthShell title="Recovery" subtitle={step === 1 ? 'Reset your password' : 'Check your email'}>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          {step === 1 ? (
            <>
              <motion.div variants={fadeUp} className="mb-6 flex justify-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--engine-dashboard)]/35 bg-[var(--engine-dashboard)]/12 text-[var(--engine-dashboard)]">
                  <KeyRound className="h-7 w-7" aria-hidden="true" />
                </span>
              </motion.div>

              <motion.form variants={staggerContainer} onSubmit={handleSubmit} className="space-y-4" noValidate>
                <motion.div variants={fadeUp} className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                  <label htmlFor="recovery-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="recovery-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      clearFieldError('email')
                    }}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/12 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-[var(--engine-dashboard)]/45"
                    autoComplete="email"
                    aria-label="Email address"
                    {...getFieldA11yProps('email')}
                  />
                  {errors.email ? (
                    <p id="email-error" className="mt-1 text-xs text-red-400" role="alert">
                      {errors.email}
                    </p>
                  ) : null}
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="glass"
                    engine="protect"
                    fullWidth
                    className="rounded-xl disabled:cursor-not-allowed disabled:opacity-70"
                    icon={loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : undefined}
                    iconPosition="left"
                  >
                    {loading ? 'Sending...' : 'Send reset link'}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div variants={fadeUp} className="mt-5 text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[var(--engine-dashboard)] hover:text-cyan-200">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to sign in
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div variants={fadeUp} className="mb-6 flex justify-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--state-healthy)]/35 bg-[var(--state-healthy)]/12 text-[var(--state-healthy)]">
                  <MailCheck className="h-7 w-7" aria-hidden="true" />
                </span>
              </motion.div>

              <motion.p variants={fadeUp} className="mb-6 text-center text-sm leading-6 text-slate-300">
                Reset link sent to <span className="font-semibold text-slate-100">{email}</span>. The link is valid for 15 minutes.
              </motion.p>

              <motion.div variants={fadeUp}>
                <Button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  variant="glass"
                  engine="protect"
                  fullWidth
                  className={`rounded-xl ${canResend ? '' : 'cursor-not-allowed border-white/10 bg-white/[0.02] text-slate-500'}`}
                >
                  {canResend ? 'Resend email' : `Resend in ${countdown}s`}
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-5 text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[var(--engine-dashboard)] hover:text-cyan-200">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to sign in
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </AuthShell>
    </>
  )
}

export default Recovery
