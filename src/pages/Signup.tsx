import React, { useMemo, useState, useCallback } from 'react';
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordScore(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ['', 'Weak', 'Fair', 'Strong', 'Secure'];
const strengthColors = ['', '#EF4444', '#EAB308', '#00F0FF', '#22C55E'];

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [updatesOptIn, setUpdatesOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; confirm?: boolean }>({});

  const pwScore = useMemo(() => passwordScore(password), [password]);

  const validate = useCallback(() => {
    const e: { email?: string; password?: string; confirm?: string } = {};
    if (!email) e.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (confirm && password && confirm !== password) e.confirm = 'Passwords do not match';
    else if (!confirm) e.confirm = 'Please confirm your password';
    return e;
  }, [email, password, confirm]);

  const handleBlur = (field: 'email' | 'password' | 'confirm') => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, ...validate() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    setTouched({ email: true, password: true, confirm: true });
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      navigate('/onboarding/connect');
    }, 1500);
  };

  const inputClass =
    'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F0FF]/50 transition-colors';

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
          <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-16">
            <img src="/logo.png" alt="" width="44" height="44" className="h-11 w-11 object-contain" aria-hidden="true" />
            <span className="text-lg font-bold" style={{ color: '#00F0FF' }}>
              Poseidon.AI
            </span>
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
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <img src="/logo.png" alt="" width="44" height="44" className="h-11 w-11 object-contain" aria-hidden="true" />
          <span className="text-xl font-bold text-white">Poseidon.AI</span>
        </div>

        <motion.div className="w-full max-w-[480px]" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-xs text-white/40 mb-8">
              {'Free forever \u00b7 No credit card \u00b7 Cancel anytime'}
            </p>
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
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aki"
                    className={`${inputClass} pl-10`}
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
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sato"
                    className={`${inputClass} pl-10`}
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
                  onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors((prev) => ({ ...prev, email: EMAIL_RE.test(e.target.value) ? undefined : (e.target.value ? 'Enter a valid email address' : 'Email is required') })); }}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@company.com"
                  className={`${inputClass} pl-10 ${touched.email && errors.email ? '!border-red-500/60' : ''}`}
                  autoComplete="email"
                  aria-invalid={!!(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? 'signup-email-err' : undefined}
                />
                {touched.email && errors.email && (
                  <p id="signup-email-err" className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>
            </motion.div>

            {/* Password + strength */}
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
                  onChange={(e) => { setPassword(e.target.value); if (touched.password) setErrors((prev) => ({ ...prev, password: e.target.value.length >= 8 ? undefined : (e.target.value ? 'Password must be at least 8 characters' : 'Password is required') })); }}
                  onBlur={() => handleBlur('password')}
                  placeholder="8+ characters"
                  className={`${inputClass} pl-10 pr-10 ${touched.password && errors.password ? '!border-red-500/60' : ''}`}
                  autoComplete="new-password"
                  aria-invalid={!!(touched.password && errors.password)}
                  aria-describedby={touched.password && errors.password ? 'signup-pw-err' : undefined}
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
              {/* Strength bar */}
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full transition-colors"
                    style={{
                      background: pwScore >= i ? strengthColors[pwScore] : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
              {password && (
                <p className="text-[10px] mt-1" style={{ color: strengthColors[pwScore] }}>
                  {strengthLabels[pwScore]}
                </p>
              )}
              {touched.password && errors.password && (
                <p id="signup-pw-err" className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
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
                  onChange={(e) => { setConfirm(e.target.value); if (touched.confirm) setErrors((prev) => ({ ...prev, confirm: e.target.value !== password ? 'Passwords do not match' : undefined })); }}
                  onBlur={() => handleBlur('confirm')}
                  placeholder="Repeat password"
                  className={`${inputClass} pl-10 pr-10 ${touched.confirm && errors.confirm ? '!border-red-500/60' : ''}`}
                  autoComplete="new-password"
                  aria-invalid={!!(touched.confirm && errors.confirm)}
                  aria-describedby={touched.confirm && errors.confirm ? 'signup-confirm-err' : undefined}
                />
                {touched.confirm && errors.confirm && (
                  <p id="signup-confirm-err" className="mt-1 text-xs text-red-400">{errors.confirm}</p>
                )}
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
