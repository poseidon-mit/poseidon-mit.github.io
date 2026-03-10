import { ArrowRight } from 'lucide-react'
import { Link } from '@/router'

interface CTAFooterProps {
  onGetStarted?: () => void
}

export default function CTAFooter({ onGetStarted }: CTAFooterProps) {
  return (
    <section className="bg-[#0A1628] py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to Transform Your Finances?
        </h2>
        <p className="text-white/70 mt-4 text-lg max-w-2xl mx-auto">
          Experience AI-native personal finance — protection, growth, execution,
          and governance in one platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-[#0A1628] px-8 py-4 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            Explore the Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">Poseidon</span>
            <span className="text-white/50 text-sm">
              &copy; 2026 Poseidon.AI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/50 text-sm hover:text-white/70 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-white/50 text-sm hover:text-white/70 transition-colors">
              Terms
            </a>
            <a href="#" className="text-white/50 text-sm hover:text-white/70 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
