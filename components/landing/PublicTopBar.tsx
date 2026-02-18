"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Waves, Menu, X } from "lucide-react"
import Link from "next/link"

export function PublicTopBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-text-primary"
          aria-label="Poseidon.AI home"
        >
          <Waves className="h-5 w-5 text-engine-protect" />
          Poseidon.AI
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          <Link
            href="/dashboard"
            className="transition-colors duration-fast hover:text-text-primary"
          >
            Product
          </Link>
          <Link
            href="/pricing"
            className="transition-colors duration-fast hover:text-text-primary"
          >
            Pricing
          </Link>
        </div>

        {/* Right: Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-text-muted transition-colors duration-fast hover:text-text-primary"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 transition-all hover:brightness-110"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-text-muted hover:text-text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
                href="/dashboard"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Product
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 text-center transition-all hover:brightness-110"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
