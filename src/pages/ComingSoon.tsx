import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from '../router';

export default function ComingSoon() {
  return (
    <div className="app-bg-oled flex min-h-screen flex-col text-white">
      <nav className="glass-header sticky top-0 z-50 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-white"
            aria-label="Poseidon.AI home"
          >
            <img src="/logo.png" alt="" width="40" height="40" className="h-10 w-10 object-contain" aria-hidden="true" />
            Poseidon.AI
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-300 text-slate-950"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
            <Construction className="h-7 w-7 text-cyan-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Coming Soon</h1>
          <p className="text-slate-400 mb-8">
            This feature is currently in development and will be available soon.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-cyan-300 transition-colors hover:text-cyan-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
