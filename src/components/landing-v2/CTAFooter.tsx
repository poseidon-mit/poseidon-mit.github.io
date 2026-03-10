import { ArrowRight } from 'lucide-react'

export default function CTAFooter() {
  return (
    <section className="bg-[#0A1628] py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to Transform Your Finances?
        </h2>
        <p className="text-white/70 mt-4 text-lg max-w-2xl mx-auto">
          Join the waitlist and be first to experience AI-native personal
          finance.
        </p>

        {/* Email form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-4 mt-8 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
          />
          <button
            type="submit"
            className="bg-white text-[#0A1628] px-6 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
          >
            Join Waitlist
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-white/50 text-sm mt-4">
          No credit card required. Cancel anytime.
        </p>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold">Poseidon</span>
            <span className="text-white/50 text-sm">
              &copy; 2026 Poseidon.AI. MIT Capstone Project.
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
