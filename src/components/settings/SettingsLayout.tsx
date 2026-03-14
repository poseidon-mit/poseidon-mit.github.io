import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Brain, Link2, Shield, User } from "lucide-react";
import { AuroraPulse } from "@/components/poseidon/aurora-pulse";
import {
  HeroBackdrop,
  HeroEyebrow,
  HeroPanel,
} from "@/components/poseidon/hero-concept-primitives";
import {
  type PerformanceProfile,
  usePerformanceProfile,
} from "@/hooks/usePerformanceProfile";
import { PAGE_CONTENT_CLASS, PAGE_CONTENT_STYLE } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export const SETTINGS_PAGE_ACCENT = "var(--engine-govern)";
const SETTINGS_EYEBROW_COLOR = "rgba(134, 185, 255, 0.8)";

export const SETTINGS_SECTION_ACCENTS = {
  profile: {
    accent: SETTINGS_PAGE_ACCENT,
    eyebrowColor: SETTINGS_EYEBROW_COLOR,
    icon: User,
    detailAccent: "rgba(88, 230, 255, 0.72)",
  },
  ai: {
    accent: SETTINGS_PAGE_ACCENT,
    eyebrowColor: SETTINGS_EYEBROW_COLOR,
    icon: Brain,
    detailAccent: "rgba(181, 143, 255, 0.76)",
  },
  integrations: {
    accent: SETTINGS_PAGE_ACCENT,
    eyebrowColor: SETTINGS_EYEBROW_COLOR,
    icon: Link2,
    detailAccent: "rgba(255, 212, 98, 0.76)",
  },
  rights: {
    accent: SETTINGS_PAGE_ACCENT,
    eyebrowColor: SETTINGS_EYEBROW_COLOR,
    icon: Shield,
    detailAccent: SETTINGS_EYEBROW_COLOR,
  },
} as const;

export function SettingsLayout({ children }: { children: ReactNode }) {
  const { profile } = usePerformanceProfile();

  return (
    <div className="hero-canvas relative flex min-h-full flex-1 flex-col overflow-hidden pb-16 text-white">
      <AuroraPulse
        color={SETTINGS_PAGE_ACCENT}
        intensity="subtle"
        performanceProfile={profile}
        className="pointer-events-none absolute inset-0 opacity-28"
      />

      <div className={PAGE_CONTENT_CLASS} style={PAGE_CONTENT_STYLE}>
        <section
          className="poseidon-settings-shell relative overflow-hidden rounded-[32px] border border-white/10"
          data-testid="settings-hero-header"
          style={{ ["--settings-accent-rgb" as string]: "59 130 246" }}
        >
          <HeroBackdrop
            accent={SETTINGS_PAGE_ACCENT}
            secondaryAccent={SETTINGS_PAGE_ACCENT}
            performanceProfile="static"
            className="opacity-80"
          />
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 md:px-10 md:py-12">
            <HeroEyebrow
              className="poseidon-settings-eyebrow w-fit"
              data-testid="settings-hero-eyebrow"
            >
              <Shield
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
                style={{ color: SETTINGS_EYEBROW_COLOR }}
              />
              Governed Control Surface
            </HeroEyebrow>
            <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-light tracking-tight text-white">
              Settings
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-white/56 md:text-base">
              Govern identity, autonomy, connected systems, and data rights
              from one control plane.
            </p>
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
  titleId,
  description,
  accent,
  eyebrowColor,
  icon: Icon,
  className,
  children,
  performanceProfile,
}: {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description?: string;
  accent: string;
  eyebrowColor?: string;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
  performanceProfile?: PerformanceProfile;
}) {
  const { profile: detectedProfile } = usePerformanceProfile();
  const effectiveProfile = performanceProfile ?? detectedProfile;

  return (
    <HeroPanel
      performanceProfile={effectiveProfile}
      className={cn("poseidon-settings-panel p-6 md:p-8", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          {eyebrow ? (
            <HeroEyebrow className="poseidon-settings-eyebrow w-fit">
              {Icon ? (
                <Icon
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                  style={{ color: eyebrowColor ?? accent }}
                />
              ) : null}
              {eyebrow}
            </HeroEyebrow>
          ) : null}
          <h2
            id={titleId}
            className="mt-4 text-[clamp(1.6rem,2.5vw,2.35rem)] font-light tracking-tight text-white"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </HeroPanel>
  );
}
