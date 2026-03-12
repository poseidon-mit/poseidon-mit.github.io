import { cn } from '@/lib/utils'
import { Link } from '@/router'
import { ChevronRight } from 'lucide-react'

export interface HeroBackdropProps {
  accent: string
  secondaryAccent?: string
  reducedMotion?: boolean
  className?: string
}

export function HeroBackdrop({
  accent,
  secondaryAccent,
  reducedMotion = false,
  className,
}: HeroBackdropProps) {
  const secondary = secondaryAccent ?? accent

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: [
            `radial-gradient(circle at 18% 4%, color-mix(in srgb, ${accent} 20%, transparent), transparent 30%)`,
            `radial-gradient(circle at 82% 12%, color-mix(in srgb, ${secondary} 14%, transparent), transparent 26%)`,
            'linear-gradient(180deg, rgba(255,255,255,0.03), transparent 34%, rgba(255,255,255,0.015) 72%, rgba(0,0,0,0.26))',
          ].join(','),
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px] opacity-[0.07]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.28)_72%)]" />
      <div
        className={cn(
          'absolute left-1/2 top-[18%] h-56 w-[82%] -translate-x-1/2 rounded-full blur-3xl opacity-45',
          !reducedMotion && 'animate-[pulse_9s_ease-in-out_infinite]',
        )}
        style={{
          background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 32%, transparent), transparent)`,
        }}
      />
    </div>
  )
}

export function HeroEyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/60',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function HeroMetricPill({
  label,
  value,
  tone,
  className,
}: {
  label: string
  value: React.ReactNode
  tone?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-1 text-base font-medium text-white" style={tone ? { color: tone } : undefined}>
        {value}
      </p>
    </div>
  )
}

export function HeroPanel({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/10 bg-black/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export interface HeroGhostLinkProps {
  to: string
  children: React.ReactNode
  engineColor: string
  className?: string
}

export function HeroGhostLink({ to, children, engineColor, className }: HeroGhostLinkProps) {
  return (
    <div className={cn("relative group inline-flex font-mono", className)}>
      <Link 
        to={to}
        className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] text-white/50 transition-all duration-500 hover:text-white hover:-translate-y-0.5"
      >
        <span className="uppercase">[ {children} ]</span>
        <ChevronRight className="h-3.5 w-3.5 opacity-40 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1" />
      </Link>
      
      {/* Underglow Sweep Effect */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div 
          className="absolute h-full w-full -translate-x-full group-hover:animate-[sweep_1.5s_ease-in-out_infinite]"
          style={{
            background: `linear-gradient(90deg, transparent, ${engineColor}, transparent)`,
            boxShadow: `0 0 10px 1px ${engineColor}`
          }}
        />
      </div>

      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
