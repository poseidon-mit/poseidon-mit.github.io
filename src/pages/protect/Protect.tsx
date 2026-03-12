import { motion } from "framer-motion";
import { ShieldAlert, Crosshair, ArrowRight, MapPin, Globe, CreditCard } from "lucide-react";
import { Link } from "@/router";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion-presets";
import { usePageTitle } from "@/hooks/use-page-title";
import { ShieldRadar } from "@/components/poseidon/ShieldRadar";
import { formatUsd } from "@/domain/poseidon-universe";

const MOCK_THREATS = [
  { id: "THR-001", title: "Miami ATM", reason: "Velocity Anomaly", amount: 800, confidence: 99, priority: "Critical", icon: MapPin },
  { id: "THR-002", title: "Synthetic Voice Auth Attempt", reason: "Deepfake Wire Transfer", amount: 4500, confidence: 96, priority: "Critical", icon: Globe },
  { id: "THR-004", title: "Off-pattern Wire Transfer", reason: "Unknown Entity", amount: 12000, confidence: 88, priority: "High", icon: ArrowRight },
  { id: "THR-003", title: "Credential Exposure", reason: "Dark Web (Uncharacteristic)", amount: 0, confidence: 92, priority: "High", icon: ShieldAlert },
  { id: "THR-005", title: "Suspicious Login", reason: "Moscow IP", amount: 0, confidence: 85, priority: "Medium", icon: Globe },
  { id: "THR-006", title: "Duplicate Subscription", reason: "Software Sublicense", amount: 120.99, confidence: 78, priority: "Low", icon: CreditCard },
];

export default function Protect() {
  usePageTitle("Protect");

  const totalExposure = MOCK_THREATS.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="w-full h-[calc(100dvh-9.5rem-env(safe-area-inset-bottom,0px))] lg:h-[calc(100dvh-5rem)] flex flex-col overflow-hidden bg-[#0A1628] text-white p-4 md:p-6 lg:p-8">
      <motion.div
        className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 min-h-0"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT COLUMN: SHIELD RADAR & OMNI-DEFENSE STATUS */}
        <motion.div
          variants={staggerItem}
          className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-10"
        >
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <span className="flex h-8 items-center rounded-full bg-red-500/10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400 border border-red-500/20 backdrop-blur-md">
              <Crosshair size={12} className="mr-2" />
              SYSTEM UNDER THREAT
            </span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-8">
            <div className="w-full max-w-[400px] aspect-square relative">
              <ShieldRadar />
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none drop-shadow-xl mb-4">
              6 Anomalies <br/><span className="text-red-400">Detected</span>
            </h1>
            <div className="flex items-end gap-6 text-white/50">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">Total Exposure</p>
                <p className="text-3xl font-mono text-white font-semibold flex items-baseline gap-1">
                  {formatUsd(totalExposure)}
                </p>
              </div>
              <div className="hidden sm:block pb-1">
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">False Positives</p>
                <p className="text-xl font-mono text-white/80">0.05%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: TRIAGE QUEUE */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/20">
            <div>
              <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                <ShieldAlert className="text-[var(--engine-protect)]" /> 
                Active Threat Triage
              </h2>
              <p className="text-sm text-white/50 mt-1">
                Poseidon has halted signatures pending your manual review.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
            {MOCK_THREATS.map((threat, idx) => {
              const Icon = threat.icon;
              return (
                <div 
                  key={threat.id} 
                  className={`group relative flex flex-col rounded-2xl border ${idx === 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-black/20 border-white/5'} p-4 transition-colors hover:bg-white/10`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'}`}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${idx === 0 ? 'text-red-300' : 'text-white/90'}`}>
                            {threat.title}
                          </h3>
                          {idx === 0 && (
                            <span className="text-[9px] uppercase tracking-wider bg-red-500 text-white px-1.5 py-0.5 rounded animate-pulse font-bold">
                              Critical
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50 mt-1">{threat.reason}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {threat.amount > 0 && <p className="text-sm font-semibold font-mono">{formatUsd(threat.amount)}</p>}
                      <p className={`text-[10px] uppercase tracking-wider font-mono mt-1 ${idx === 0 ? 'text-red-400' : 'text-white/40'}`}>
                        {threat.confidence}% Conf.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 md:p-6 pt-2 shrink-0">
            <Link
              to="/execute"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 border border-red-500/30 py-4 text-sm font-bold tracking-wide transition hover:bg-red-500/30 text-red-200"
            >
              FREEZE COMPROMISED ACCOUNTS <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
