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
              <span className="text-sm text-gray-700">{driver.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {driver.value}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
