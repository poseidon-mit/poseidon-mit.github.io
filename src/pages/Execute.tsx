import { motion } from "framer-motion";
import { Lock, ArrowRight, Zap, FileText, Landmark, KeySquare, Briefcase, FileSignature, Coins, Send, Receipt, Component, Shield } from "lucide-react";
import { Link } from "@/router";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion-presets";
import { usePageTitle } from "@/hooks/use-page-title";
import { CryptographicVault } from "@/components/poseidon/CryptographicVault";
import { formatUsd } from "@/domain/poseidon-universe";

const MOCK_EXECUTIONS = [
  { id: "EXE-001", title: "Wire to Sterling Escrow", action: "Real Estate Closing (Atherton)", amount: 2400000, tags: ["Irreversible", "High Priority"], icon: Send, engine: 'Execute', urgent: true },
  { id: "EXE-002", title: "Approve LP Capital Call", action: "Sequoia Capital Fund IX", amount: 500000, tags: ["Commitment", "Wire"], icon: Landmark, engine: 'Grow', urgent: true },
  { id: "EXE-003", title: "Tax-Loss Harvesting Order", action: "Swap MSFT for VTI", amount: 145000, tags: ["Algorithmic", "Tax"], icon: Component, engine: 'Grow', urgent: false },
  { id: "EXE-004", title: "Payroll Execution", action: "Q3 Bonus Cycle & Salary", amount: 82500, tags: ["Scheduled", "ACH"], icon: Briefcase, engine: 'Execute', urgent: false },
  { id: "EXE-005", title: "Freeze Compromised Card", action: "Amex Platinum (Ending 4012)", amount: 0, tags: ["Security", "Immediate"], icon: Lock, engine: 'Protect', urgent: true },
  { id: "EXE-006", title: "Initiate Beneficiary Change", action: "Irrevocable Family Trust", amount: 0, tags: ["Legal", "Signature Needed"], icon: FileSignature, engine: 'Govern', urgent: false },
  { id: "EXE-007", title: "Lock CD Ladder", action: "JPMorgan Chase 5.25% 6mo", amount: 150000, tags: [" Treasury", "Yield"], icon: Receipt, engine: 'Grow', urgent: false },
  { id: "EXE-008", title: "Private Equity Signature", action: "Subscription Agreement Annex B", amount: 0, tags: ["Legal", "DocuSign"], icon: FileText, engine: 'Execute', urgent: false },
  { id: "EXE-009", title: "Authorize Vault Storage Fee", action: "Geneva FreePort Storage", amount: 12500, tags: ["Invoice", "Wire"], icon: KeySquare, engine: 'Execute', urgent: false },
  { id: "EXE-010", title: "Crypto OTC Settlement", action: "Acquire 100 ETH (Coinbase Prime)", amount: 235000, tags: ["Irreversible", "Web3"], icon: Coins, engine: 'Grow', urgent: false },
  { id: "EXE-011", title: "Liquidate RSU Vest", action: "Meta Platforms Inc. (META)", amount: 142000, tags: ["Equity", "Market Order"], icon: Zap, engine: 'Grow', urgent: false },
  { id: "EXE-012", title: "Form 1040 & 8949 Filing", action: "CPA Authorization Signature", amount: 0, tags: ["Tax", "Deadline"], icon: FileText, engine: 'Govern', urgent: true },
  { id: "EXE-013", title: "Renew Term Life Insurance", action: "$5M Policy Premium", amount: 6200, tags: ["Living", "Auto-Pay"], icon: Shield, engine: 'Protect', urgent: false },
  { id: "EXE-014", title: "Fund Donor-Advised Fund", action: "Fidelity Charitable Transfer", amount: 100000, tags: ["Tax Deduction", "Philanthropy"], icon: Landmark, engine: 'Grow', urgent: false },
  { id: "EXE-015", title: "Angel Invest Seed Round", action: "Y-Combinator Startup (SAFE)", amount: 50000, tags: ["Alternative", "Wire"], icon: Zap, engine: 'Execute', urgent: false },
];

export default function Execute() {
  usePageTitle("Execute");

  const totalCapital = MOCK_EXECUTIONS.reduce((sum, e) => sum + e.amount, 0);
  const urgentCount = MOCK_EXECUTIONS.filter(e => e.urgent).length;

  return (
    <div className="w-full h-[calc(100dvh-9.5rem-env(safe-area-inset-bottom,0px))] lg:h-[calc(100dvh-5rem)] flex flex-col overflow-hidden bg-[#0A1628] text-white p-4 md:p-6 lg:p-8">
      <motion.div
        className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 min-h-0"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* LEFT COLUMN: CRYPTOGRAPHIC VAULT & OMNI-EXECUTION STATUS */}
        <motion.div
          variants={staggerItem}
          className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-10"
        >
          {/* Subtle amber highlight at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(234,179,8,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <span className="flex h-8 items-center rounded-full bg-[var(--engine-execute)]/10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--engine-execute)] border border-[var(--engine-execute)]/20 backdrop-blur-md">
              <Lock size={12} className="mr-2" />
              15 SIGNATURES PENDING
            </span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-8">
            <div className="w-full max-w-[500px] aspect-square relative">
              <CryptographicVault />
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none drop-shadow-xl mb-4">
              Cryptographic <br/><span className="text-[var(--engine-execute)]">Launchpad</span>
            </h1>
            <div className="flex items-end gap-6 text-white/50">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">Capital in Motion</p>
                <p className="text-3xl font-mono text-white font-semibold flex items-baseline gap-1">
                  {formatUsd(totalCapital)}
                </p>
              </div>
              <div className="hidden sm:block pb-1">
                <p className="text-xs uppercase tracking-widest font-semibold mb-1">Time Saved</p>
                <p className="text-xl font-mono text-white/80">4.5 hrs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: APPROVAL QUEUE (15 items scrolling) */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col overflow-hidden rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/20">
            <div>
              <h2 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                <Zap className="text-[var(--engine-execute)]" /> 
                Omni-Approval Queue
              </h2>
              <p className="text-sm text-white/50 mt-1">
                {urgentCount} actions require immediate attention.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
            {MOCK_EXECUTIONS.map((execution, idx) => {
              const Icon = execution.icon;
              return (
                <div 
                  key={execution.id} 
                  className={`group relative flex flex-col rounded-2xl border ${execution.urgent ? 'bg-[var(--engine-execute)]/10 border-[var(--engine-execute)]/30' : 'bg-black/20 border-white/5'} p-4 transition-colors hover:bg-white/10`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${execution.urgent ? 'bg-[var(--engine-execute)]/20 text-[var(--engine-execute)]' : 'bg-white/10 text-white/60'}`}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${execution.urgent ? 'text-[var(--engine-execute)]' : 'text-white/90'}`}>
                            {execution.title}
                          </h3>
                        </div>
                        <p className="text-xs text-white/50 mt-1">{execution.action}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-white/40 px-1.5 py-0.5 rounded">
                            {execution.engine}
                          </span>
                          {execution.tags.map(t => (
                            <span key={t} className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-white/40 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {execution.amount > 0 && <p className={`text-sm font-semibold font-mono ${execution.urgent ? 'text-[var(--engine-execute)]' : 'text-white/80'}`}>{formatUsd(execution.amount)}</p>}
                      {execution.amount === 0 && <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mt-1 pr-1">SIG ONLY</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 md:p-6 pt-2 shrink-0">
            <Link
              to="/execute/approval?actionId=EXE-001"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--engine-execute)]/20 border border-[var(--engine-execute)]/30 py-4 text-sm font-bold tracking-wide transition hover:bg-[var(--engine-execute)]/30 text-[var(--engine-execute)]"
            >
              APPROVE ALL BATCH <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
