import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from '@/router';
import { Button, ButtonLink } from '@/design-system';
import { JETON_EASING } from './jeton-config';

export function MenuOverlay() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[rgba(5,5,8,0.52)] text-white backdrop-blur-xl transition-colors duration-300"
      aria-label="Main navigation"
      data-nav-theme="dark"
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

        <div className="hidden items-center gap-8 text-sm text-white/76 md:flex">
          <a href="#platform" className="transition-colors hover:text-inherit">
            Product
          </a>
          <Link to="/pricing" className="transition-colors hover:text-inherit">
            Pricing
          </Link>
          <Link to="/login" className="transition-colors hover:text-inherit">
            Sign in
          </Link>
        </div>

        <div className="hidden md:block">
          <ButtonLink
            to="/signup"
            variant="glass"
            engine="dashboard"
            size="sm"
            className="rounded-full"
          >
            Get Started
          </ButtonLink>
        </div>

        <Button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex !h-10 !min-h-10 !w-10 items-center justify-center rounded-full border border-current/20 !px-0 md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          variant="ghost"
          size="sm"
          springPress={false}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: JETON_EASING }}
            className="overflow-hidden border-t border-white/10 bg-[rgba(5,5,8,0.96)] md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-5 text-sm">
              <a href="#platform" onClick={() => setMobileOpen(false)}>
                Product
              </a>
              <Link to="/pricing" onClick={() => setMobileOpen(false)}>
                Pricing
              </Link>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
              <ButtonLink
                to="/signup"
                variant="glass"
                engine="dashboard"
                size="sm"
                className="rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </ButtonLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
