import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from '@/router';
import { Button, ButtonLink } from '@/design-system';
import { JETON_EASING } from './jeton-config';
import { LANDING_COPY } from '@/content/landing-copy';

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
          aria-label={LANDING_COPY.nav.brandAriaLabel}
        >
          <img src="/logo.png" alt="" width="30" height="30" className="h-[30px] w-[30px]" aria-hidden="true" />
          {LANDING_COPY.nav.brandText}
        </Link>

        <div className="flex items-center gap-4">
          <ButtonLink
            to="/dashboard"
            variant="glass"
            engine="dashboard"
            size="sm"
            className="rounded-full"
          >
            {LANDING_COPY.nav.primaryCta}
          </ButtonLink>
        </div>
      </div>
    </nav>
  );
}
