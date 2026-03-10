import { Check } from 'lucide-react'

const bullets = [
  'End-to-end encryption for all data in transit and at rest',
  'SOC 2 Type II certified infrastructure',
  'Read-only account access — we never move your money',
  'Full audit trail for every AI decision',
]

const auditEntries = [
  {
    time: '2 min ago',
    action: 'Portfolio rebalance recommended',
    engine: 'Grow',
    color: '#7C3AED',
  },
  {
    time: '15 min ago',
    action: 'Suspicious transaction flagged',
    engine: 'Protect',
    color: '#16A34A',
  },
  {
    time: '1 hr ago',
    action: 'Bill payment scheduled',
    engine: 'Execute',
    color: '#CA8A04',
  },
]

export default function TrustSecurity() {
  return (
    <section className="bg-[#F0EFEB] py-24 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        {/* Left */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
            Security First
          </p>
          <h2 className="text-4xl font-bold text-[#1A1A1A] mt-2">
            Trust Through Transparency
          </h2>
          <p className="text-stone-500 mt-4">
            Every decision Poseidon makes is logged, explained, and reversible.
            You stay in control with complete visibility into how your money is
            managed.
          </p>

          <ul className="mt-6 space-y-3">
            {bullets.map((text) => (
              <li key={text} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                <span className="text-stone-600 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Audit trail card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
            Live Audit Trail
          </p>
          <div className="space-y-4">
            {auditEntries.map((entry) => (
              <div
                key={entry.action}
                className="flex items-start gap-3 pb-4 border-b border-stone-100 last:border-0 last:pb-0"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {entry.action}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: entry.color }}
                    >
                      {entry.engine}
                    </span>
                    <span className="text-xs text-stone-400">{entry.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
