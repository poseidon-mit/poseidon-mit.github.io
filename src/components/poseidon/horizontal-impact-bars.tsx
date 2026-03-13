import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Factor {
  label: string;
  value: number; // e.g., 92, -10
}

interface HorizontalImpactBarsProps {
  factors: Factor[];
}

export function HorizontalImpactBars({ factors }: HorizontalImpactBarsProps) {
  // Find the maximum absolute value to scale the bars correctly
  const maxAbsValue = Math.max(...factors.map(f => Math.abs(f.value)), 100);

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 relative py-2">
      {/* Center Axis Line */}
      <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 -translate-x-1/2 z-0" />

      {factors.map((factor, index) => {
        // Assume factor.value is a decimal like 0.96 or -0.10. Convert to percentage points.
        const normalizedValue = factor.value * 100;
        const isPositive = normalizedValue >= 0;
        const barWidthPercentage = (Math.abs(normalizedValue) / maxAbsValue) * 100;
        
        // Define colors based on positive/negative impact
        const barColor = isPositive ? "var(--engine-grow)" : "var(--state-error)";
        const barGlow = isPositive ? "rgba(139, 92, 246, 0.4)" : "rgba(239, 68, 68, 0.4)"; // Violet vs Red glow

        return (
          <div key={index} className="flex flex-row items-center relative z-10 w-full h-[24px]">
            {/* Left Label */}
            <div className="flex-[0_0_35%] pr-4 text-right overflow-hidden">
              <span className="text-[11px] text-white/60 truncate block w-full" title={factor.label}>
                {factor.label}
              </span>
            </div>

            {/* Center Bar Area */}
            <div className="flex-[0_0_40%] flex items-center shrink-0">
              <div className="w-1/2 flex justify-end">
                {!isPositive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidthPercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="h-[4px] rounded-l-full relative"
                    style={{ 
                      backgroundColor: barColor,
                      boxShadow: `0 0 8px ${barGlow}`
                    }}
                  />
                )}
              </div>
              <div className="w-1/2 flex justify-start">
                {isPositive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidthPercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="h-[4px] rounded-r-full relative"
                    style={{ 
                      backgroundColor: barColor,
                      boxShadow: `0 0 8px ${barGlow}`
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right Value */}
            <div className="flex-[0_0_25%] pl-4">
              <span 
                className={cn(
                  "text-xs font-mono font-bold whitespace-nowrap drop-shadow-md",
                )}
                style={{ color: barColor }}
              >
                {isPositive ? "+" : ""}{normalizedValue.toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
