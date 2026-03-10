import { Shield, TrendingUp, Zap, Eye } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface EngineCard {
  label: string
  title: string
  description: string
  color: string
  borderColor: string
  icon: LucideIcon
}

const engines: EngineCard[] = [
  {
    label: 'PROTECT',
    title: 'Guardian of Your Wealth',
    description:
      'AI-powered fraud detection, insurance optimization, and risk monitoring that never sleeps.',
    color: '#16A34A',
    borderColor: 'border-l-[#16A34A]',
    icon: Shield,
  },
  {
    label: 'GROW',
    title: 'Intelligent Wealth Building',
    description:
      'Personalized investment strategies, tax optimization, and compound growth automation.',
    color: '#7C3AED',
    borderColor: 'border-l-[#7C3AED]',
    icon: TrendingUp,
  },
  {
    label: 'EXECUTE',
    title: 'Effortless Money Movement',
    description:
      'Smart bill pay, automated savings, and optimized cash flow management.',
    color: '#CA8A04',
    borderColor: 'border-l-[#CA8A04]',
    icon: Zap,
  },
  {
    label: 'GOVERN',
    title: 'Complete Visibility & Control',
    description:
      'Real-time dashboards, audit trails, and AI-explained decisions you can trust.',
    color: '#2563EB',
    borderColor: 'border-l-[#2563EB]',
    icon: Eye,
  },
]

export default function EngineShowcase() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#1A1A1A]">
          Four Engines. One Platform.
        </h2>
        <p className="text-stone-500 text-center mt-4 max-w-2xl mx-auto">
          Each engine specializes in a critical aspect of your financial life,
          working together as one coordinated system.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {engines.map((engine) => {
            const Icon = engine.icon
            return (
              <div
                key={engine.label}
                className={`bg-white border border-stone-200 rounded-2xl p-8 hover:shadow-lg transition-shadow border-l-4 ${engine.borderColor}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: engine.color }}
                  />
                  <span
                    className="uppercase tracking-wider text-xs font-semibold"
                    style={{ color: engine.color }}
                  >
                    {engine.label}
                  </span>
                </div>

                <div className="flex items-start justify-between mt-4">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">
                    {engine.title}
                  </h3>
                  <Icon
                    className="w-6 h-6 flex-shrink-0 ml-4 mt-1"
                    style={{ color: engine.color }}
                  />
                </div>

                <p className="text-stone-500 mt-2">{engine.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
