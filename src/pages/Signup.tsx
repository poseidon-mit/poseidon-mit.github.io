import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, TrendingUp, Zap, Scale,
  CheckCircle, Eye, EyeOff, Mail, Lock, User, Loader2,
} from 'lucide-react';
import { Link, useRouter } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const valueProps = [
  { icon: Shield, color: '#22C55E', label: 'Protect', desc: 'Fraud blocked in <100ms with explainable AI' },
  { icon: TrendingUp, color: '#8B5CF6', label: 'Grow', desc: 'Personalized forecasts and savings automation' },
  { icon: Zap, color: '#EAB308', label: 'Execute', desc: 'Consent-first actions with full audit trail' },
  { icon: Scale, color: '#3B82F6', label: 'Govern', desc: 'Every decision logged and explained' },
];

const avatars = [
  { initials: 'MK', bg: '#22C55E' },
  { initials: 'JL', bg: '#8B5CF6' },
  { initials: 'AR', bg: '#3B82F6' },
];

export function Signup() {
  const { navigate } = useRouter();
  const [firstName, setFirstName] = useState('Shinji');
  const [lastName, setLastName] = useState('Fujiwara');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [updatesOptIn, setUpdatesOptIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    setLoading(true);
    setTimeout(() => {
      navigate('/onboarding/connect');
    }, 1500);
  };

  const handleSSOLogin = (provider: string) => {
    void provider;
    setLoading(true);
    setTimeout(() => {
      navigate('/onboarding/connect');
    }, 1500);
  };

  const inputClass =
    'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors';

  const inputDisabledStyle = { pointerEvents: 'none' as const, userSelect: 'none' as const };

  return (
    <div className="min-h-screen w-full flex" style={{ background: '#0B1221' }}>
      {/* ── Left Panel ── */}
      <div
        className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between border-r border-white/[0.06] relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0B1221 0%, #060D1A 100%)' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div
          className="relative z-10 flex flex-col px-10 pt-10 pb-8 flex-1"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Wordmark */}
          <motion.div variants={fadeUp} className="flex items-center gap-1.5 mb-16">
            <img src="/logo.png" alt="" width="44" height="44" className="h-11 w-11 object-contain" aria-hidden="true" />
            <span className="text-lg font-light tracking-widest text-white">Poseidon</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-3xl font-bold text-white mb-3 leading-tight text-balance">
            Your money, finally coordinated.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-white/60 leading-relaxed mb-10 max-w-[340px]">
            AI that detects threats, grows wealth, and executes actions — with your consent, every time.
          </motion.p>

          {/* Value props */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4 mb-auto">
            {valueProps.map((vp) => (
              <div key={vp.label} className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${vp.color}15` }}
                >
                  <vp.icon className="h-4 w-4" style={{ color: vp.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{vp.label}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{vp.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Social proof card */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/[0.06] p-4 mt-8"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <p className="text-sm text-white/70 italic leading-relaxed mb-3">
              {'"92% of users catch a hidden fee in the first week"'}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {avatars.map((a) => (
                  <div
                    key={a.initials}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#060D1A]"
                    style={{ background: a.bg }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/40">14,000+ users protected</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 md:px-12 py-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-1.5 mb-8">
          <img src="/logo.png" alt="" width="44" height="44" className="h-11 w-11 object-contain" aria-hidden="true" />
          <span className="text-xl font-light tracking-widest text-white">Poseidon</span>
        </div>

        <motion.div className="w-full max-w-[480px]" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-xs text-white/40 mb-8">
              {'Free forever \u00b7 No credit card \u00b7 Cancel anytime'}
            </p>
          </motion.div>

          {/* SSO buttons */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSSOLogin('apple')}
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white py-3 text-sm text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
            <button
              type="button"
              onClick={() => handleSSOLogin('google')}
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/70 font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name row */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-first">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    id="signup-first"
                    type="text"
                    value={firstName}
                    readOnly
                    tabIndex={-1}
                    placeholder="Shinji"
                    className={`${inputClass} pl-10`}
                    style={inputDisabledStyle}
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-last">
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    id="signup-last"
                    type="text"
                    value={lastName}
                    readOnly
                    tabIndex={-1}
                    placeholder="Fujiwara"
                    className={`${inputClass} pl-10`}
                    style={inputDisabledStyle}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp}>
              <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  readOnly
                  tabIndex={-1}
                  placeholder="you@company.com"
                  className={`${inputClass} pl-10`}
                  style={inputDisabledStyle}
                  autoComplete="email"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp}>
              <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-pw">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="signup-pw"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  tabIndex={-1}
                  placeholder="8+ characters"
                  className={`${inputClass} pl-10 pr-10`}
                  style={inputDisabledStyle}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm password */}
            <motion.div variants={fadeUp}>
              <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-confirm">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  readOnly
                  tabIndex={-1}
                  placeholder="Repeat password"
                  className={`${inputClass} pl-10 pr-10`}
                  style={inputDisabledStyle}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {/* Checkboxes */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2 mt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-[#00F0FF]"
                />
                <span className="text-xs text-white/50">
                  {'I agree to the '}
                  <span className="underline" style={{ color: '#00F0FF' }}>Terms of Service</span>
                  {' and '}
                  <span className="underline" style={{ color: '#00F0FF' }}>Privacy Policy</span>
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updatesOptIn}
                  onChange={(e) => setUpdatesOptIn(e.target.checked)}
                  className="mt-0.5 accent-[#00F0FF]"
                />
                <span className="text-xs text-white/50">Keep me informed about product updates</span>
              </label>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={!termsAccepted || loading}
                className="w-full rounded-xl font-bold py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-40 mt-2 flex items-center justify-center gap-2"
                style={{ background: '#00F0FF', color: '#0B1221' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account \u2192'
                )}
              </button>
            </motion.div>
          </form>

          {/* Sign in link */}
          <motion.p variants={fadeUp} className="text-center text-sm text-white/40 mt-6">
            {'Already have an account? '}
            <Link to="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#00F0FF' }}>
              {'Sign in \u2192'}
            </Link>
          </motion.p>

          {/* Trust strip */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { icon: Lock, text: 'Bank-grade security' },
              { icon: Shield, text: 'GDPR compliant' },
              { icon: CheckCircle, text: '100% auditable' },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-1.5">
                <t.icon className="h-3.5 w-3.5 text-white/30" />
                <span className="text-xs text-white/40">{t.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
