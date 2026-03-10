import { ArrowRight, Play } from 'lucide-react'
import { Link } from '@/router'

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <span className="text-xl font-bold text-[#0A1628] tracking-tight">
          Poseidon
        </span>
        <Link
          to="/dashboard"
          className="bg-[#0A1628] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0A1628]/90 transition-colors"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium">
          AI-Native Personal Finance
        </p>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A1628] text-center leading-tight mt-6 whitespace-pre-line">
          {'Your Money,\nOrchestrated by AI'}
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl text-center mt-6">
          Poseidon unifies protection, growth, execution, and governance into
          one intelligent platform that coordinates your entire financial life.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            to="/dashboard"
            className="bg-[#0A1628] text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#0A1628]/90 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            className="border-2 border-[#0A1628] text-[#0A1628] px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-zinc-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </button>
        </div>

        <p className="text-xs text-zinc-400 mt-8">
          MIT Capstone &middot; Bank-Level Security
        </p>
      </div>
    </section>
  )
}
