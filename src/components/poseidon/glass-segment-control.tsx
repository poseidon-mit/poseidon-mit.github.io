import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlassSegmentControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  accent?: "cyan" | "violet" | "amber" | "green" | "blue";
}

export function GlassSegmentControl<T extends string>({
  options,
  value,
  onChange,
  accent = "cyan",
}: GlassSegmentControlProps<T>) {
  const accentBorderMap = {
    cyan: "border-cyan-500/50 bg-cyan-500/10 text-cyan-50 shadow-[0_0_15px_rgba(34,211,238,0.2)]",
    violet: "border-violet-500/50 bg-violet-500/10 text-violet-50 shadow-[0_0_15px_rgba(139,92,246,0.2)]",
    amber: "border-amber-500/50 bg-amber-500/10 text-amber-50 shadow-[0_0_15px_rgba(251,191,36,0.2)]",
    green: "border-emerald-500/50 bg-emerald-500/10 text-emerald-50 shadow-[0_0_15px_rgba(52,211,153,0.2)]",
    blue: "border-blue-500/50 bg-blue-500/10 text-blue-50 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
  };

  return (
    <div className="flex p-1.5 gap-1.5 glass-surface rounded-xl border border-white/[0.06] relative w-full overflow-x-auto">
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "relative px-4 py-2 text-xs font-medium rounded-lg transition-colors flex-1 text-center cursor-pointer min-w-max",
              isActive ? "text-white" : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={`segment-active-${options.join("-")}`}
                className={cn(
                  "absolute inset-0 rounded-lg border",
                  accentBorderMap[accent]
                )}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
