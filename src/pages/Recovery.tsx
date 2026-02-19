import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Mail, MailCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from '../router';
import { fadeUp, staggerContainer as stagger } from '@/lib/motion-presets'

export function Recovery() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setCountdown(60);
      setCanResend(false);
    }, 1200);
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
  };

  useEffect(() => {
    if (step !== 2) return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4" style={{ background: '#0B1221' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: 'var(--engine-dashboard)', color: '#0B1221' }}
      >
        Skip to main content
      </a>
      <motion.main
        id="main-content"
        role="main"
        className="w-full max-w-md flex flex-col items-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {step === 1 ? (
          <>
            {/* Step 1 — Enter email */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(0,240,255,0.1)' }}>
                <KeyRound className="h-8 w-8" style={{ color: 'var(--engine-dashboard)' }} />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 w-full">
              <h1 className="text-2xl font-bold text-white mb-2 text-center">Reset your password</h1>
              <p className="text-sm text-slate-400 text-center mb-6">Enter your email and we&apos;ll send a reset link.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--engine-dashboard)]/50 transition-colors"
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl font-semibold py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'var(--engine-dashboard)', color: '#0B1221' }}
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : 'Send reset link'}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-dashboard)' }}>
                  <ArrowLeft className="inline h-3.5 w-3.5 mr-1" />
                  Back to sign in
                </Link>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Step 2 — Email sent */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(34,197,94,0.1)', boxShadow: '0 0 30px rgba(34,197,94,0.15)' }}>
                <MailCheck className="h-8 w-8 text-emerald-400" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 w-full text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-sm text-slate-400 mb-6">
                Reset link sent to <span className="text-white font-medium">{email}</span>. Valid for 15 minutes.
              </p>

              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`w-full rounded-xl border py-3 text-sm font-medium transition-colors ${canResend ? 'border-white/10 text-white/70 hover:bg-white/10' : 'border-white/5 text-white/30 cursor-not-allowed'}`}
              >
                {canResend ? 'Resend email' : `Resend in ${countdown}s`}
              </button>

              <div className="mt-4">
                <Link to="/login" className="text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-dashboard)' }}>
                  <ArrowLeft className="inline h-3.5 w-3.5 mr-1" />
                  Back to sign in
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </motion.main>
    </div>
  );
}

export default Recovery;
