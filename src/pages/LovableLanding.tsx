import { Link } from '@/router'
import { Shield, TrendingUp, Zap, FileText } from 'lucide-react'

const engines = [
  { icon: Shield, label: 'Protect', color: 'text-green-400', desc: 'AI-powered threat detection' },
  { icon: TrendingUp, label: 'Grow', color: 'text-purple-400', desc: 'Smart savings & growth' },
  { icon: Zap, label: 'Execute', color: 'text-yellow-400', desc: 'Human-approved automation' },
  { icon: FileText, label: 'Govern', color: 'text-blue-400', desc: 'Complete audit trail' },
] as const

const trustSignals = [
  { value: '1,247', label: 'Transactions Protected' },
  { value: '100%', label: 'Auditable' },
  { value: '$3,601', label: 'Savings Identified' },
] as const

export default function LovableLanding() {
  return (
    <div className="bg-slate-900 min-h-screen text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col items-center gap-16">

        {/* Section 1: Hero */}
        <section className="flex flex-col items-center text-center gap-6">
          <div
            className="bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs animate-slide-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            MIT Professional Education CTO Program
          </div>

          <div
            className="flex items-center gap-2 animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <span className="text-cyan-400 text-4xl">🔱</span>
            <span className="text-3xl font-bold">Poseidon</span>
            <span className="text-3xl font-bold text-cyan-400">.AI</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-slide-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            The Trusted AI-Native Money Platform
          </h1>

          <p
            className="text-lg text-gray-400 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
          >
            Deterministic models compute. GenAI explains. AI Agents execute. Humans confidently approve.
          </p>

          <div
            className="flex flex-wrap justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
          >
            <Link
              to="/dashboard?demo=true"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/25 text-lg font-semibold min-h-[44px] inline-flex items-center transition"
            >
              Explore Demo
            </Link>
            <Link
              to="/onboarding"
              className="bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-xl min-h-[44px] inline-flex items-center transition"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Section 2: Engine Cards */}
        <section
          className="grid grid-cols-2 gap-4 max-w-3xl mx-auto w-full animate-slide-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          {engines.map(({ icon: Icon, label, color, desc }) => (
            <div
              key={label}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
            >
              <Icon className={`w-6 h-6 ${color} mb-3`} />
              <h3 className="font-semibold mb-1">{label}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </section>

        {/* Section 3: Trust Signals */}
        <section
          className="flex justify-center gap-8 sm:gap-16 animate-slide-up"
          style={{ animationDelay: '0.7s', animationFillMode: 'both' }}
        >
          {trustSignals.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold font-mono">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer
          className="text-gray-600 text-sm text-center animate-slide-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
        >
          MIT Professional Education &middot; CTO Program &middot; Group 7
        </footer>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
