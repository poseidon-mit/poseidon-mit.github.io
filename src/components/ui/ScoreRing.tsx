interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  segments?: { color: string; value: number }[];
}

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  segments = [],
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate segment arcs
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulativeOffset = 0;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Colored segments */}
        {segments.map((seg, i) => {
          const segLen = (seg.value / total) * circumference * (score / 100);
          const offset = circumference - segLen;
          const rotation = (cumulativeOffset / total) * 360 * (score / 100);
          cumulativeOffset += seg.value;
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segLen} ${circumference - segLen}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
                filter: `drop-shadow(0 0 6px ${seg.color}40)`,
              }}
            />
          );
        })}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#F1F5F9]">{score}</span>
        <span className="text-xs text-[#64748B]">/ 100</span>
      </div>
    </div>
  );
}
