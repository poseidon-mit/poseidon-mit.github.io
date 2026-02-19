import { Link } from '@/router';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1221] px-6 py-16 text-white/70 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs tracking-[0.08em]">
          MIT Sloan CTO Program · Group 7 · 2026
        </p>
        <div className="flex items-center gap-6 text-xs">
          <Link to="/trust" className="transition-colors hover:text-white">
            Trust
          </Link>
          <Link to="/pricing" className="transition-colors hover:text-white">
            Pricing
          </Link>
          <Link to="/help" className="transition-colors hover:text-white">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
