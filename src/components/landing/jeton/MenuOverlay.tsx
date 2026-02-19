import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from '@/router';
import type { JetonNavTheme } from './hooks/useJetonNavTheme';
import { JETON_EASING } from './jeton-config';

interface MenuOverlayProps {
  navTheme: JetonNavTheme;
}

export function MenuOverlay({ navTheme }: MenuOverlayProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = navTheme === 'dark';

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        isDark
          ? 'border-white/10 bg-[#0B1221]/42 text-white backdrop-blur-xl'
          : 'border-slate-200/70 bg-white/88 text-slate-900 backdrop-blur-xl'
      }`}
      aria-label="Main navigation"
      data-nav-theme={navTheme}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-[0.08em]"
          aria-label="Poseidon home"
        >
          <img src="/logo.png" alt="" width="30" height="30" className="h-[30px] w-[30px]" aria-hidden="true" />
          POSEIDON
        </Link>

        <div className={`hidden items-center gap-8 text-sm md:flex ${isDark ? 'text-white/76' : 'text-slate-600'}`}>
          <a href="#platform" className="transition-colors hover:text-inherit">
            Platform
          </a>
          <a href="#governance" className="transition-colors hover:text-inherit">
            Governance
          </a>
          <a href="#cta" className="transition-colors hover:text-inherit">
            Start
          </a>
        </div>

        <div className="hidden md:block">
          <Link
            to="/signup"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 transition-all duration-200 hover:scale-[0.985]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/20 md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: JETON_EASING }}
            className={`overflow-hidden border-t md:hidden ${
              isDark ? 'border-white/10 bg-[#0B1221]/96' : 'border-slate-200/80 bg-white/96'
            }`}
          >
            <div className="flex flex-col gap-4 px-6 py-5 text-sm">
              <a href="#platform" onClick={() => setMobileOpen(false)}>
                Platform
              </a>
              <a href="#governance" onClick={() => setMobileOpen(false)}>
                Governance
              </a>
              <a href="#cta" onClick={() => setMobileOpen(false)}>
                Start
              </a>
              <Link
                to="/signup"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
