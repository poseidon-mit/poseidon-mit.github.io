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

      </div>
    </nav>
  )
}
