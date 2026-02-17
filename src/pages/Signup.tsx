import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Link, useRouter } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function passwordScore(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', '#EF4444', '#EAB308', '#00F0FF', '#22C55E'];

export function Signup() {
  const { navigate } = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeUpdates, setAgreeUpdates] = useState(false);

  const pwScore = useMemo(() => passwordScore(password), [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/connect');
  };

  const inputClass = 'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00F0FF]/50 transition-colors';

  return (
    <div className="min-h-screen w-full flex" style={{ background: '#0B1221' }}>
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, #0B1221, #0F1D32)' }}
      >
        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <motion.div className="relative z-10 flex flex-col items-center text-center max-w-md" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <Shield className="h-16 w-16 mb-4" style={{ color: '#00F0FF' }} />
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl font-bold text-white mb-2">Poseidon.AI</motion.h1>
          <motion.p variants={fadeUp} className="text-sm text-slate-400 mb-8">Trusted Financial Sentience</motion.p>

          <motion.div variants={fadeUp} className="flex flex-col gap-3 text-left w-full mb-10">
            {['Real-time threat detection', 'Explainable AI decisions', 'Full audit trail'].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-white/70">{f}</span>
              </div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 w-full">
            <p className="text-sm text-white/60 italic leading-relaxed mb-3">
              &ldquo;Poseidon gave us the confidence to automate financial decisions with full transparency.&rdquo;
            </p>
            <div>
              <p className="text-xs font-semibold text-white/80">Sarah Chen</p>
              <p className="text-xs text-white/40">VP Finance, Meridian Corp</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <Shield className="h-6 w-6" style={{ color: '#00F0FF' }} />
          <span className="text-xl font-bold text-white">Poseidon.AI</span>
        </div>

        <motion.div className="w-full max-w-md" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Create your account</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-first">First name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input id="signup-first" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Aki" className={`${inputClass} pl-10`} autoComplete="given-name" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-last">Last name</label>
                  <input id="signup-last" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sato" className={inputClass} autoComplete="family-name" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={`${inputClass} pl-10`} autoComplete="email" />
                </div>
              </div>

              {/* Password + strength */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-pw">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input id="signup-pw" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters" className={`${inputClass} pl-10 pr-10`} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength bar */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-colors" style={{ background: pwScore >= i ? strengthColors[pwScore] : 'rgba(255,255,255,0.1)' }} />
                  ))}
                </div>
                {password && <p className="text-[10px] mt-1" style={{ color: strengthColors[pwScore] }}>{strengthLabels[pwScore]}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="signup-confirm">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input id="signup-confirm" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className={`${inputClass} pl-10 pr-10`} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors" aria-label={showConfirm ? 'Hide confirmation' : 'Show confirmation'}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-2 mt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 accent-[#00F0FF]" />
                  <span className="text-xs text-white/50">I agree to the <span className="underline" style={{ color: '#00F0FF' }}>Terms of Service</span> and <span className="underline" style={{ color: '#00F0FF' }}>Privacy Policy</span></span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={agreeUpdates} onChange={(e) => setAgreeUpdates(e.target.checked)} className="mt-0.5 accent-[#00F0FF]" />
                  <span className="text-xs text-white/50">Send me product updates</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!agreeTerms}
                className="w-full rounded-xl font-semibold py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-40 mt-2"
                style={{ background: '#00F0FF', color: '#0B1221' }}
              >
                Create account
              </button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              {'Already have an account? '}
              <Link to="/login" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#00F0FF' }}>
                {'Sign in \u2192'}
              </Link>
            </p>
          </motion.div>

          {/* Trust signals */}
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
