import { motion } from "framer-motion";
import { Scale, ArrowRight, ShieldCheck, Database, FileKey, Server, Fingerprint, Activity, Clock, Key, Shield, Network } from "lucide-react";
import { Link } from "@/router";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion-presets";
import { usePageTitle } from "@/hooks/use-page-title";
import { MatrixRain } from "@/components/poseidon/effects/MatrixRain";

const MOCK_LEDGER = [
  { id: "LED-8092", event: "Cryptographic Receipt Generated", detail: "Wire to Sterling Escrow (EXE-001)", time: "Just now", engine: "Execute", icon: FileKey, status: "Verified" },
  { id: "LED-8091", event: "User Override Captured", detail: "Dismissed Threat THR-002", time: "2 min ago", engine: "Protect", icon: Fingerprint, status: "Verified" },
  { id: "LED-8090", event: "Policy Delta Applied", action: "Auth-Threshold = 99%", time: "15 min ago", engine: "Govern", icon: Scale, status: "Verified" },
  { id: "LED-8089", event: "Model Drift Anomaly", detail: "LLM latency spike > 120ms (Groq)", time: "1 hr ago", engine: "Govern", icon: Activity, status: "Flagged" },
  { id: "LED-8088", event: "Agent Handshake Verified", detail: "Grow Engine <> Execute Engine", time: "2 hrs ago", engine: "System", icon: Network, status: "Verified" },
  { id: "LED-8087", event: "Data Lineage Trace", detail: "Source Confirmed (Strategy REC-004)", time: "3 hrs ago", engine: "Grow", icon: Database, status: "Verified" },
  { id: "LED-8086", event: "New Beneficiary Hash", detail: "Committed to Immutable Ledger", time: "4 hrs ago", engine: "Govern", icon: Server, status: "Verified" },
  { id: "LED-8085", event: "Audit Exported", detail: "Quarterly KYC Compliance Package", time: "5 hrs ago", engine: "Govern", icon: ShieldCheck, status: "Verified" },
  { id: "LED-8084", event: "Admin Access Granted", detail: "Temporary Elevation (15m window)", time: "12 hrs ago", engine: "System", icon: Key, status: "Verified" },
  { id: "LED-8083", event: "Risk Parameter Updated", detail: "Auto-freeze constraint tightened", time: "14 hrs ago", engine: "Protect", icon: Shield, status: "Verified" },
  { id: "LED-8082", event: "Signature Verified", detail: "SEC Form 4 Filing", time: "18 hrs ago", engine: "Govern", icon: FileKey, status: "Verified" },
  { id: "LED-8081", event: "SLA Enforced", detail: "Wire request delayed via timeout rule", time: "1 day ago", engine: "Execute", icon: Clock, status: "Flagged" },
  { id: "LED-8080", event: "Smart Contract Ping", detail: "Escrow unlock successful on-chain", time: "1 day ago", engine: "Execute", icon: Network, status: "Verified" },
  { id: "LED-8079", event: "Zero-Knowledge Auth", detail: "Identity asserted without PII leak", time: "2 days ago", engine: "System", icon: Fingerprint, status: "Verified" },
  { id: "LED-8078", event: "Token Refresh", detail: "Auth session securely rotated", time: "2 days ago", engine: "System", icon: Key, status: "Verified" },
];

export default function Govern() {
  usePageTitle("Govern");

  const totalAudits = 1428590; 

  return (
    <div className="w-full h-[calc(100dvh-9.5rem-env(safe-area-inset-bottom,0px))] lg:h-[calc(100dvh-5rem)] flex flex-col overflow-hidden bg-[#0A1628] text-white p-4 md:p-6 lg:p-8">
      <motion.div
        className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 min-h-0"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT COLUMN: MATRIX RAIN & OMNI-GOVERN STATUS */}
        <motion.div
          variants={staggerItem}
          className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-10"
        >
          <div className="absolute inset-x-0 bottom-0 top-0 opacity-40 pointer-events-none mix-blend-screen mix-blend-plus-lighter">
            <MatrixRain columnCount={50} color="var(--engine-govern)" />
          </div>
          
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <span className="flex h-8 items-center rounded-full bg-[var(--engine-govern)]/10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--engine-govern)] border border-[var(--engine-govern)]/20 backdrop-blur-md">
              <Scale size={12} className="mr-2" />
              IMMUTABLE AUDIT TRACE
            </span>
          </div>

          <div className="relative z-10 flex-1 flex items-center">
             <div className="font-mono text-xs text-[var(--engine-govern)]/60 leading-relaxed overflow-hidden max-h-full">
               <p>{`>>> ESTABLISHING LEDGER SECURE TUNNEL`}</p>
               <p>{`>>> KERNEL INTEGRITY: 100% OK`}</p>
               <p>{`>>> VERIFYING ROOT MERKLE HASH...`}</p>
               <p className="mt-4">{`BLOCK 1428590`}</p>
               <p>{`HASH: 0x9a8f...4e2b`}</p>
               <p>{`SIGNATURES: VALID`}</p>
               <p className="mt-4">{`Poseidon Govern Engine operates a mathematically verified paper trail for every AI decision.`}</p>
             </div>
          </div>

          <div className="relative z-10 mt-8">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none drop-shadow-xl mb-4">
              Immutable <br/><span className="text-[var(--engine-govern)]">Ledger</span>
            </h1>
            <div className="flex items-end gap-6 text-white/50">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">Total Audits</p>
                <p className="text-3xl font-mono text-white font-semibold flex items-baseline gap-1">
                  1,428,590
                </p>
              </div>
              <div className="hidden sm:block pb-1">
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">Audit Coverage</p>
                <p className="text-xl font-mono text-white/80">100%</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: GOVERNANCE LEDGER (15 items) */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/20">
            <div>
              <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                <ShieldCheck className="text-[var(--engine-govern)]" /> 
                Live Audit Stream
              </h2>
              <p className="text-sm text-white/50 mt-1">
                Every system mutation is cryptographically sealed.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
            {MOCK_LEDGER.map((entry, idx) => {
              const Icon = entry.icon;
              return (
                <div 
                  key={entry.id} 
                  className="group relative flex flex-col rounded-2xl border bg-black/20 border-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10 text-white/60">
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white/90">
                            {entry.event}
                          </h3>
                        </div>
                        <p className="text-xs text-white/50 mt-1">{entry.detail || entry.action}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-white/40 px-1.5 py-0.5 rounded">
                            {entry.engine}
                          </span>
                          <span className={`text-[9px] uppercase tracking-wider border px-1.5 py-0.5 rounded ${entry.status === 'Verified' ? 'bg-[var(--engine-govern)]/10 border-[var(--engine-govern)]/30 text-[var(--engine-govern)]' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-white/40 font-mono">{entry.id}</p>
                      <p className="text-xs text-white/30 mt-1">{entry.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 md:p-6 pt-2 shrink-0">
            <Link
              to="/govern/audit-detail?decision=LED-8092"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--engine-govern)]/20 border border-[var(--engine-govern)]/30 py-4 text-sm font-bold tracking-wide transition hover:bg-[var(--engine-govern)]/30 text-[var(--engine-govern)]"
            >
              EXPORT KYC COMPLIANCE PACKAGE <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
