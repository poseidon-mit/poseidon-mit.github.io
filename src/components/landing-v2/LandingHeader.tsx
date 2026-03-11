import { Link } from '@/router'

export default function LandingHeader() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md bg-slate-950/80">
      <div className="flex items-center gap-2">
        <img
          src="/favicon.svg"
          alt=""
          className="h-7 w-7 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
        />
        <span className="text-xl font-bold text-white tracking-tight">Poseidon</span>
      </div>
      <Link
        to="/dashboard"
        className="hidden md:inline-flex bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
      >
        Launch App
      </Link>
    </nav>
  )
}
