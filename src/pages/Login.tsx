import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useRouter } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validate = useCallback(() => {
    const e: { email?: string; password?: string } = {};
    if (!email) e.email = 'Email is required';
    else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    return e;
  }, [email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, ...validate() }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: '#0B1221' }}>
      {/* Logo */}
      <motion.div
        className="flex flex-col items-center pt-12 pb-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-1">
          <Shield className="h-7 w-7" style={{ color: '#00F0FF' }} />
          <span className="text-2xl font-bold text-white">Poseidon.AI</span>
        </motion.div>
        <motion.p variants={fadeUp} className="text-xs text-slate-400">Trusted Financial Sentience</motion.p>
      </motion.div>

      {/* Centered card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <motion.div
          className="w-full max-w-md"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Welcome back</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="login-email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (touched.email) setErrors((prev) => ({ ...prev, email: EMAIL_RE.test(e.target.value) ? undefined : (e.target.value ? 'Enter a valid email address' : 'Email is required') })); }}
                    onBlur={() => handleBlur('email')}
                    placeholder="you@company.com"
                    className={`w-full rounded-xl bg-white/5 border pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors ${touched.email && errors.email ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/10 focus:border-[#00F0FF]/50'}`}
                    autoComplete="email"
                    aria-invalid={!!(touched.email && errors.email)}
                    aria-describedby={touched.email && errors.email ? 'login-email-err' : undefined}
                  />
                  {touched.email && errors.email && (
                    <p id="login-email-err" className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-white/50 uppercase tracking-wider" htmlFor="login-password">Password</label>
                  <Link to="/recovery" className="text-xs hover:opacity-80 transition-opacity" style={{ color: '#00F0FF' }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (touched.password) setErrors((prev) => ({ ...prev, password: e.target.value ? undefined : 'Password is required' })); }}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter your password"
                    className={`w-full rounded-xl bg-white/5 border pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors ${touched.password && errors.password ? 'border-red-500/60 focus:border-red-500/80' : 'border-white/10 focus:border-[#00F0FF]/50'}`}
                    autoComplete="current-password"
                    aria-invalid={!!(touched.password && errors.password)}
                    aria-describedby={touched.password && errors.password ? 'login-pw-err' : undefined}
                  />
                  {touched.password && errors.password && (
                    <p id="login-pw-err" className="mt-1 text-xs text-red-400">{errors.password}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl font-semibold py-3 text-sm transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: '#00F0FF', color: '#0B1221' }}
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in...</> : 'Sign in'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/70 font-medium hover:bg-white/10 transition-colors"
              >
                Continue with Google
              </button>
            </form>

            <p className="text-center text-sm text-white/40 mt-6">
              {"Don't have an account? "}
              <Link to="/signup" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#00F0FF' }}>
                {'Sign up \u2192'}
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

          {/* Footer */}
          <motion.p variants={fadeUp} className="text-center text-xs text-white/20 mt-8">
            &copy; 2026 Poseidon.AI &middot; MIT Sloan CTO Program
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
