import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useRouter } from '@/router'
import { Eye, EyeOff, Waves, Shield, Lock } from "lucide-react"
import { PublicTopBar } from '@/components/landing/PublicTopBar'

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { navigate } = useRouter()

  return (
    <>
      <PublicTopBar />
      <main id="main-content" className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: "radial-gradient(50% 40% at 70% 0%, rgba(0,240,255,0.04), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ── Left: Value prop ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:sticky lg:top-24"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6">
              <Waves size={24} style={{ color: "var(--engine-dashboard)" }} />
              <span className="text-lg font-bold" style={{ color: "#F1F5F9" }}>Poseidon.AI</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4 text-balance"
              style={{ color: "#F1F5F9" }}
            >
              Welcome back to your{" "}
              <span style={{ color: "var(--engine-dashboard)" }}>command center</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base mb-8" style={{ color: "#94A3B8" }}>
              Your AI engines have been working while you were away. Sign in to review decisions and take action.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm" style={{ color: "#CBD5E1" }}>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ background: "rgba(0,240,255,0.08)" }}
                >
                  <Shield size={16} style={{ color: "var(--engine-dashboard)" }} />
                </div>
                Encrypted end-to-end
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: "#CBD5E1" }}>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ background: "rgba(0,240,255,0.08)" }}
                >
                  <Lock size={16} style={{ color: "var(--engine-dashboard)" }} />
                </div>
                Every session fully auditable
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="glass-surface rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6" style={{ color: "#F1F5F9" }}>Sign in</h2>

              {/* SSO */}
              <div className="flex flex-col gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#F1F5F9",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#F1F5F9",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-xs" style={{ color: "#64748B" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Email form */}
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "#64748B" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#F1F5F9",
                    }}
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: "#64748B" }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="w-full rounded-xl px-4 py-3 pr-10 text-sm outline-none transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#F1F5F9",
                      }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? (
                        <EyeOff size={16} style={{ color: "#64748B" }} />
                      ) : (
                        <Eye size={16} style={{ color: "#64748B" }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 rounded flex items-center justify-center transition-colors"
                      style={{
                        background: rememberMe ? "var(--engine-dashboard)" : "rgba(255,255,255,0.06)",
                        border: rememberMe ? "none" : "1px solid rgba(255,255,255,0.12)",
                      }}
                      aria-checked={rememberMe}
                      role="checkbox"
                    >
                      {rememberMe && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#0B1221" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>Remember me</span>
                  </label>
                  <Link to="/recovery" className="text-xs font-medium" style={{ color: "var(--engine-dashboard)" }}>
                    Forgot password?
                  </Link>
                </div>

                {/* CTA: Primary -> /dashboard */}
                <Link
                  to="/dashboard"
                  className="block text-center text-sm font-semibold py-3 rounded-xl mt-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #14B8A6, #06B6D4)",
                    color: "#0B1221",
                  }}
                >
                  Sign in
                </Link>
              </form>

              <p className="text-center text-xs mt-4" style={{ color: "#64748B" }}>
                {"Don't have an account? "}
                <Link to="/signup" className="font-medium" style={{ color: "var(--engine-dashboard)" }}>
                  Create one
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      </main>
    </>
  )
}
