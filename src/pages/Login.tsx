import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useRouter } from '../router';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

export function Login() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleSSOLogin = (provider: string) => {
    void provider;
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
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
        <motion.div variants={fadeUp} className="flex items-center gap-1.5 mb-1">
          <img src="/logo.png" alt="" width="36" height="36" className="h-9 w-9 object-contain" aria-hidden="true" />
          <span className="text-2xl font-light tracking-widest text-white">Poseidon</span>
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

            {/* SSO buttons */}
            <div className="flex flex-col gap-3 mb-6">
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
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

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
                    readOnly
                    tabIndex={-1}
                    placeholder="you@company.com"
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                    autoComplete="email"
                  />
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
                    readOnly
                    tabIndex={-1}
                    placeholder="Enter your password"
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none transition-colors"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                    autoComplete="current-password"
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
