import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Link2,
  type LucideIcon,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { AuroraPulse } from "@/components/poseidon";
import {
  HeroBackdrop,
  HeroPanel,
} from "@/components/poseidon/hero-concept-primitives";
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from "@/lib/page-layout";
import { Link } from "@/router";
import { cn } from "@/lib/utils";

export type SettingsPath =
  | "/settings"
  | "/settings/ai"
  | "/settings/integrations"
  | "/settings/rights";

interface SettingsRouteDescriptor {
  path: SettingsPath;
  label: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  icon: LucideIcon;
  accent: string;
  accentGlow: string;
}

export const SETTINGS_ROUTES: Record<SettingsPath, SettingsRouteDescriptor> = {
  "/settings": {
    path: "/settings",
    label: "Overview",
    shortLabel: "Overview",
    eyebrow: "Settings Control Plane",
    title: "System settings",
    description: "Start here, then open AI, integrations, or rights when you need detail.",
    summary: "Profile and entry points.",
    icon: SlidersHorizontal,
    accent: "var(--engine-dashboard)",
    accentGlow: "rgba(0, 240, 255, 0.22)",
  },
  "/settings/ai": {
    path: "/settings/ai",
    label: "AI",
    shortLabel: "AI",
    eyebrow: "AI Configuration",
    title: "AI delegation",
    description: "Set the approval ceiling and default AI voice.",
    summary: "Limits and tone.",
    icon: BrainCircuit,
    accent: "var(--engine-grow)",
    accentGlow: "rgba(139, 92, 246, 0.22)",
  },
  "/settings/integrations": {
    path: "/settings/integrations",
    label: "Integrations",
    shortLabel: "Integrations",
    eyebrow: "Connected Systems",
    title: "Connected systems",
    description: "See what is connected and which scopes are active.",
    summary: "Connections and scopes.",
    icon: Link2,
    accent: "var(--engine-execute)",
    accentGlow: "rgba(234, 179, 8, 0.2)",
  },
  "/settings/rights": {
    path: "/settings/rights",
    label: "Rights",
    shortLabel: "Rights",
    eyebrow: "Data Rights",
    title: "Rights & retention",
    description: "Control consent, retention, export, and deletion in one place.",
    summary: "Consent and deletion.",
    icon: ShieldAlert,
    accent: "var(--engine-govern)",
    accentGlow: "rgba(59, 130, 246, 0.22)",
  },
};

export const SETTINGS_NAV = [
  SETTINGS_ROUTES["/settings"],
  SETTINGS_ROUTES["/settings/ai"],
  SETTINGS_ROUTES["/settings/integrations"],
  SETTINGS_ROUTES["/settings/rights"],
] as const;

export function SettingsLayout({
  currentPath,
  children,
}: {
  currentPath: string;
  children: ReactNode;
}) {
  const normalizedPath =
    (currentPath in SETTINGS_ROUTES
      ? currentPath
      : "/settings") as SettingsPath;
  const currentView = SETTINGS_ROUTES[normalizedPath];

  return (
    <div className="hero-canvas relative flex min-h-full flex-1 flex-col overflow-hidden pb-16 text-white">
      <AuroraPulse
        color={currentView.accent}
        intensity="subtle"
        className="pointer-events-none absolute inset-0 opacity-40"
      />

      <div className={PAGE_CONTENT_CLASS} style={PAGE_CONTENT_STYLE}>
        <section
          className="hero-canvas relative overflow-hidden rounded-[32px] border border-white/10"
        >
          <HeroBackdrop accent={currentView.accent} secondaryAccent="#020202" />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 md:px-10 md:py-12">
            <div className="space-y-3">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.22em]"
                style={{
                  color: `color-mix(in srgb, ${currentView.accent} 70%, rgba(255,255,255,0.38))`,
                }}
              >
                {currentView.eyebrow}
              </p>
              <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-light tracking-tight text-white">
                {currentView.title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/56 md:text-base">
                {currentView.description}
              </p>
            </div>

            <nav
              className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5"
              aria-label="Settings workspace navigation"
            >
              {SETTINGS_NAV.map((item) => {
                const isActive = item.path === normalizedPath;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    prefetch="render"
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200",
                      isActive ? "text-white" : "text-white/40 hover:text-white/72",
                    )}
                    style={isActive ? { color: item.accent } : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function SettingsPanel({
  eyebrow,
  title,
  description,
  accent,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  accent: string;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <HeroPanel className={cn("p-6 md:p-8", className)}>
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p
              className="font-mono text-[11px] uppercase tracking-[0.22em]"
              style={{
                color: `color-mix(in srgb, ${accent} 68%, rgba(255,255,255,0.34))`,
              }}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-[clamp(1.75rem,2.5vw,2.5rem)] font-semibold tracking-tight text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/52">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </HeroPanel>
  );
}

export function SettingsMetric({
  label,
  value,
  detail,
  accent,
  className,
}: {
  label: string;
  value: string;
  detail?: string;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      <div className="h-1 w-10 rounded-full" style={{ backgroundColor: accent }} />
      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
        {value}
      </p>
      {detail ? <p className="mt-1 text-xs text-white/46">{detail}</p> : null}
    </div>
  );
}

export function SettingsWorkspaceCard({
  path,
  eyebrow,
  title,
  description,
  accent,
}: {
  path: SettingsPath;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      to={path}
      prefetch="render"
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-black/28 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.04] md:p-7"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.6,
        }}
      />
      <div className="relative">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: `color-mix(in srgb, ${accent} 68%, rgba(255,255,255,0.34))` }}
        >
          {eyebrow}
        </p>
        <h3 className="mt-4 text-[clamp(1.75rem,2vw,2.25rem)] font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/54">{description}</p>
        <div
          className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-transform duration-200 group-hover:translate-x-0.5"
          style={{ color: accent }}
        >
          Open workspace
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
