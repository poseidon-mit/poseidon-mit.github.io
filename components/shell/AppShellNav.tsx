"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  Waves,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, engine: "dashboard" },
  { href: "/protect", label: "Protect", icon: Shield, engine: "protect" },
  { href: "/grow", label: "Grow", icon: TrendingUp, engine: "grow" },
  { href: "/execute", label: "Execute", icon: Zap, engine: "execute" },
  { href: "/govern", label: "Govern", icon: Scale, engine: "govern" },
] as const

const engineColors: Record<string, string> = {
  dashboard: "var(--engine-dashboard)",
  protect: "var(--engine-protect)",
  grow: "var(--engine-grow)",
  execute: "var(--engine-execute)",
  govern: "var(--engine-govern)",
}

export function AppShellNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden lg:flex fixed left-0 top-0 h-full w-16 flex-col items-center gap-2 py-4 z-40"
        style={{ background: "rgba(11,18,33,0.95)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-xl mb-4"
          style={{ background: "rgba(0,240,255,0.08)" }}
          aria-label="Poseidon.AI home"
        >
          <Waves size={20} style={{ color: "var(--engine-dashboard)" }} />
        </Link>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const color = isActive ? engineColors[item.engine] : "#64748B"
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all group"
              style={{
                background: isActive ? `rgba(255,255,255,0.06)` : "transparent",
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon size={20} style={{ color }} />
              <span
                className="text-[9px] font-semibold mt-0.5 uppercase tracking-wider"
                style={{ color }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile bottom bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2 px-1"
        style={{
          background: "rgba(11,18,33,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
        }}
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const color = isActive ? engineColors[item.engine] : "#64748B"
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all"
              style={{
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
              }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon size={18} style={{ color }} />
              <span
                className="text-[9px] font-semibold mt-0.5 uppercase tracking-wider"
                style={{ color }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
