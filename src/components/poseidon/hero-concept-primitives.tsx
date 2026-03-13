import { cn } from "@/lib/utils";
import { Link } from "@/router";
import { ChevronRight } from "lucide-react";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

export interface HeroBackdropProps {
  accent: string;
  secondaryAccent?: string;
  reducedMotion?: boolean;
  className?: string;
}

export function HeroBackdrop({
  accent,
  secondaryAccent,
  reducedMotion = false,
  className,
}: HeroBackdropProps) {
  const secondary = secondaryAccent ?? accent;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: [
            `radial-gradient(circle at 18% 4%, color-mix(in srgb, ${accent} 20%, transparent), transparent 30%)`,
            `radial-gradient(circle at 82% 12%, color-mix(in srgb, ${secondary} 14%, transparent), transparent 26%)`,
            "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 34%, rgba(255,255,255,0.015) 72%, rgba(0,0,0,0.26))",
          ].join(","),
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px] opacity-[0.07]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.28)_72%)]" />
      <div
        className={cn(
          "absolute left-1/2 top-[18%] h-56 w-[82%] -translate-x-1/2 rounded-full blur-3xl opacity-45",
          !reducedMotion && "animate-[pulse_9s_ease-in-out_infinite]",
        )}
        style={{
          background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 32%, transparent), transparent)`,
        }}
      />
    </div>
  );
}

export function HeroEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/60",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HeroMetricPill({
  label,
  value,
  tone,
  className,
}: {
  label: string;
  value: React.ReactNode;
  tone?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
      <p
        className="mt-1 text-base font-medium text-white"
        style={tone ? { color: tone } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

export function HeroPanel({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-black/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface HeroUnifiedFooterProps {
  to: string;
  label: string;
  engineColor: string;
  icon?: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

export function HeroUnifiedFooter({
  to,
  label,
  engineColor,
  icon: Icon,
}: HeroUnifiedFooterProps) {
  const reducedMotion = useReducedMotionSafe();

  // Make enough copies to ensure the screen is always filled during the scroll
  const repeatCount = 8;
  const items = Array.from({ length: repeatCount });

  return (
    <Link
      to={to}
      className={cn(
        "group relative mt-auto flex w-full items-center border-t border-white/5 bg-transparent py-5 transition-all duration-500 hover:bg-[#050510] hover:border-white/10 z-10 overflow-hidden",
        reducedMotion ? "justify-center" : "",
      )}
    >
      {/* Test / Accessibility anchor to prevent RTL 'multiple elements' errors */}
      <span className="sr-only">{label}</span>

      {/* Top border glow effect */}
      <div
        className="absolute top-0 left-0 w-full h-[1px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${engineColor}, transparent)`,
          boxShadow: `0 0 10px 1px ${engineColor}`,
        }}
      />

      {/* Dynamic Glow Effect on Text */}
      <style>{`
        .group:hover .marquee-text-glow {
          text-shadow: 0 0 15px color-mix(in srgb, ${engineColor} 80%, transparent);
          color: #fff;
        }
      `}</style>

      {reducedMotion ? (
        <div className="flex items-center gap-3 px-6">
          {Icon && (
            <Icon
              className="h-4 w-4 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
              style={{ color: engineColor }}
            />
          )}
          <span className="marquee-text-glow font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/40 transition-all duration-300">
            [ {label} ]
          </span>
          <ChevronRight
            className="h-4 w-4 opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
            style={{ color: engineColor }}
          />
        </div>
      ) : (
        <div
          className="flex whitespace-nowrap group-hover:[animation-play-state:paused] animate-[marquee_25s_linear_infinite]"
          aria-hidden="true"
        >
          {/* Group 1 */}
          <div className="flex items-center justify-around shrink-0 min-w-full">
            {items.map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-6 shrink-0">
                {Icon && (
                  <Icon
                    className="h-3.5 w-3.5 opacity-30 transition-all duration-300 group-hover:opacity-100"
                    style={{ color: engineColor }}
                  />
                )}
                <span className="marquee-text-glow font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/30 transition-all duration-300">
                  {label}
                </span>
                <span className="text-white/10 text-[10px]">&bull;</span>
              </div>
            ))}
          </div>
          {/* Group 2 for seamless loop */}
          <div className="flex items-center justify-around shrink-0 min-w-full">
            {items.map((_, i) => (
              <div
                key={`dup-${i}`}
                className="flex items-center gap-8 px-6 shrink-0"
              >
                {Icon && (
                  <Icon
                    className="h-3.5 w-3.5 opacity-30 transition-all duration-300 group-hover:opacity-100"
                    style={{ color: engineColor }}
                  />
                )}
                <span className="marquee-text-glow font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/30 transition-all duration-300">
                  {label}
                </span>
                <span className="text-white/10 text-[10px]">&bull;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marquee Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Link>
  );
}
