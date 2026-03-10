import { Check, Shield, TrendingUp, Zap, Eye } from 'lucide-react'

const miniEngines = [
  { label: 'Protect', value: 'Active', color: '#16A34A', icon: Shield },
  { label: 'Grow', value: '+12.4%', color: '#7C3AED', icon: TrendingUp },
  { label: 'Execute', value: '3 pending', color: '#CA8A04', icon: Zap },
  { label: 'Govern', value: 'All clear', color: '#2563EB', icon: Eye },
]

const callouts = [
  'Real-time portfolio tracking across all accounts',
  'AI-powered insights delivered daily',
  'One-click actions on every recommendation',
]

export default function DashboardPreview() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#1A1A1A]">
          Your Command Center
        </h2>
        <p className="text-stone-500 text-center mt-4 max-w-2xl mx-auto">
          A unified view of your entire financial life, powered by AI.
        </p>

        {/* Mock dashboard */}
        <div className="bg-[#0A1628] rounded-2xl p-2 shadow-2xl max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl p-6 md:p-8">
            {/* Net worth */}
            <div>
              <p className="text-sm text-stone-500 font-medium">
                Total Net Worth
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-bold text-[#1A1A1A]">
                  $847,392
                </span>
                <span className="text-sm font-semibold text-[#16A34A]">
                  +$12,847 (1.5%)
                </span>
              </div>
            </div>

            {/* Mini engine cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {miniEngines.map((engine) => {
                const Icon = engine.icon
                return (
                  <div
                    key={engine.label}
                    className="border border-stone-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: engine.color }}
                      />
                      <span className="text-xs text-stone-500 font-medium">
                        {engine.label}
                      </span>
                    </div>
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: engine.color }}
                    >
                      {engine.value}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Callouts */}
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 mt-10">
          {callouts.map((text) => (
            <div key={text} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#16A34A] flex-shrink-0" />
              <span className="text-sm text-stone-600">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
