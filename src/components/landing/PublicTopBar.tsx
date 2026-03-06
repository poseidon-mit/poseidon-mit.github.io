import { Link } from '@/router'

interface PublicTopBarProps {
  variant?: 'minimal' | 'landing'
}

export function PublicTopBar({ variant = 'minimal' }: PublicTopBarProps) {
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

        {variant === 'landing' && (
          <>
            {/* Desktop: full action cluster */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/deck" className="text-sm text-slate-300 hover:text-white transition-colors">
                Presentation
              </Link>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:from-teal-400 hover:to-cyan-300 transition-all"
              >
                Get Started
              </Link>
            </div>
            {/* Mobile: Sign In always accessible (Get Started via hero CTA) */}
            <div className="flex md:hidden items-center">
              <Link
                to="/login"
                className="text-sm text-slate-300 hover:text-white min-h-[44px] flex items-center transition-colors"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
