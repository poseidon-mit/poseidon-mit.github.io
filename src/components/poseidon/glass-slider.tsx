import { cn } from "@/lib/utils";

export interface GlassSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  accent?: "cyan" | "violet" | "amber" | "green" | "blue";
}

export function GlassSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatLabel = (v) => String(v),
  accent = "amber",
}: GlassSliderProps) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const accentColorMap = {
    cyan: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]",
    violet: "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]",
    amber: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]",
    green: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]",
    blue: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]",
  };

  const activeColorMap = {
    cyan: "bg-cyan-400/80",
    violet: "bg-violet-500/80",
    amber: "bg-amber-400/80",
    green: "bg-emerald-400/80",
    blue: "bg-blue-500/80",
  };

  const labelColorMap = {
    cyan: "text-cyan-300",
    violet: "text-violet-300",
    amber: "text-amber-300",
    green: "text-emerald-300",
    blue: "text-blue-300",
  };

  return (
    <div className="relative w-full pt-8 pb-4 group">
      <div
        className={cn(
          "absolute top-0 left-0 text-sm font-mono transition-opacity",
          labelColorMap[accent],
        )}
      >
        {formatLabel(value)}
      </div>
      
      <div className="relative h-6 flex items-center w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Slider"
        />
        {/* Track */}
        <div className="h-1.5 w-full bg-white/[0.04] rounded-full border border-white/[0.06] overflow-hidden relative">
          <div
            className={cn("h-full transition-all duration-150 rounded-full", activeColorMap[accent])}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/80 transition-all duration-150 pointer-events-none",
            accentColorMap[accent]
          )}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}
