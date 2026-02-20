import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Link } from '@/router'
import { Button, ButtonLink } from '@/design-system'

export function PublicTopBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className="glass-header sticky top-0 z-50 border-b border-white/[0.06]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5"
          aria-label="Poseidon.AI home"
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

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <Link
            to="/dashboard"
            className="transition-colors duration-fast hover:text-text-primary"
          >
            Product
          </Link>
          <Link
            to="/pricing"
            className="transition-colors duration-fast hover:text-text-primary"
          >
            Pricing
          </Link>
        </div>

        {/* Right: Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-text-muted transition-colors duration-fast hover:text-text-primary"
          >
            Sign in
          </Link>
          <ButtonLink
            to="/signup"
            variant="glass"
            engine="dashboard"
            size="sm"
            className="rounded-xl"
          >
            Get Started
          </ButtonLink>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          engine="dashboard"
          size="sm"
          className="md:hidden text-text-muted hover:text-text-primary transition-colors !h-9 !min-h-9 !w-9 !px-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <Link
                to="/dashboard"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Product
              </Link>
              <Link
                to="/pricing"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/login"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <ButtonLink
                to="/signup"
                variant="glass"
                engine="dashboard"
                size="sm"
                className="rounded-xl text-center"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
