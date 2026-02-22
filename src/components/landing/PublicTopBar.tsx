import { Link } from '@/router'

export function PublicTopBar() {
  return (
    <nav
      className="glass-header fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/40 backdrop-blur-3xl"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex h-20 items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5"
          aria-label="Poseidon home"
        >
          <img
            src="/logo.png"
            alt=""
            width="36"
            height="36"
            className="h-9 w-9 object-contain drop-shadow-[0_0_3px_rgba(0,240,255,0.3)]"
            aria-hidden="true"
          />
          <span className="text-xl font-light tracking-widest text-slate-50">Poseidon</span>
        </Link>

        {/* Right: CTA Button (always visible) */}
        <Link
          to="/signup"
          className="flex items-center gap-2 bg-[#0a0a12] border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3),0_0_4px_rgba(139,92,246,0.4),inset_0_0_12px_rgba(16,185,129,0.06)] px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-cabin font-semibold text-sm hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(16,185,129,0.5),0_0_8px_rgba(139,92,246,0.6),inset_0_0_16px_rgba(16,185,129,0.1)] hover:border-emerald-400/50 transition-all"
        >
          <span className="bg-gradient-to-r from-[#34D399] to-[#A78BFA] bg-clip-text text-transparent">Activate</span>
        </Link>
      </div>
    </nav>
  )
}
