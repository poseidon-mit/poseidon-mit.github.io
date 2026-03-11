interface DecisionDriversProps {
  drivers: { label: string; value: number }[];
}

export function LovableDecisionDrivers({ drivers }: DecisionDriversProps) {
  const maxValue = Math.max(...drivers.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {drivers.map((driver) => {
        const widthPercent = (driver.value / maxValue) * 100;
        return (
          <div key={driver.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white/70">{driver.label}</span>
              <span className="text-sm font-medium text-white">
                {driver.value}%
              </span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
