/**
 * Orchestrator Workbench v2.0 — Audit Chain Verifier
 * Inline chain integrity indicator with verification status.
 */

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { verifyChain } from '@/lib/orchestrator/audit-chain'

export function AuditChainVerifier() {
  const { state } = useWorkbenchContext()
  const [verifying, setVerifying] = useState(false)
  const [lastResult, setLastResult] = useState<boolean | null>(null)

  const handleVerify = useCallback(async () => {
    setVerifying(true)
    try {
      const isValid = await verifyChain(state.auditTrail.events)
      setLastResult(isValid)
    } catch {
      setLastResult(false)
    } finally {
      setVerifying(false)
    }
  }, [state.auditTrail.events])

  const chainValid = state.auditTrail.chainValid

  return (
    <div className="flex items-center gap-2">
      {/* Status Indicator */}
      <span
        className={cn(
          'flex items-center gap-1 text-[10px] font-mono',
          chainValid ? 'text-green-400/70' : 'text-red-400/70',
        )}
      >
        <motion.span
          animate={chainValid ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 3 }}
          className={cn(
            'inline-block w-1.5 h-1.5 rounded-full',
            chainValid ? 'bg-green-400' : 'bg-red-400',
          )}
        />
        {chainValid ? 'Chain ✓' : 'Chain ⚠'}
      </span>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={verifying}
        className={cn(
          'px-2 py-0.5 rounded text-[9px] font-medium transition-all',
          verifying
            ? 'bg-white/[0.03] text-white/20 cursor-wait'
            : 'bg-white/[0.05] text-white/40 hover:text-white/60 hover:bg-white/[0.08]',
        )}
      >
        {verifying ? 'Verifying...' : 'Re-verify'}
      </button>

      {/* Last Result */}
      {lastResult !== null && !verifying && (
        <span
          className={cn(
            'text-[9px] font-mono',
            lastResult ? 'text-green-400/60' : 'text-red-400/60',
          )}
        >
          {lastResult ? '✓ Passed' : '✗ Failed'}
        </span>
      )}
    </div>
  )
}
