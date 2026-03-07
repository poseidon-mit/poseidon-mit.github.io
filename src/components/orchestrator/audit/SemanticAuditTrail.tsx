/**
 * Orchestrator Workbench v2.0 — Semantic Audit Trail
 * 3-layer audit trail: Deterministic Log + GenAI Translation + Human Add-on
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useWorkbenchContext } from '@/contexts/WorkbenchContext'
import { DeterministicLogPane } from './DeterministicLogPane'
import { GenAiTranslationPane } from './GenAiTranslationPane'
import { HumanAddonEditor } from './HumanAddonEditor'
import { AuditChainVerifier } from './AuditChainVerifier'
import { staggerContainer, fadeUp } from '@/lib/motion-presets'

type AuditTab = 'deterministic' | 'translation' | 'addon'

export function SemanticAuditTrail() {
  const { state } = useWorkbenchContext()
  const [activeTab, setActiveTab] = useState<AuditTab>('deterministic')
  const isGovern = state.themeMode.mode === 'govern'

  const tabs: { id: AuditTab; label: string; icon: string; count: number }[] = [
    {
      id: 'deterministic',
      label: 'Deterministic Log',
      icon: '📋',
      count: state.auditTrail.events.length,
    },
    {
      id: 'translation',
      label: 'AI Translation',
      icon: '🤖',
      count: state.auditTrail.translations.length,
    },
    {
      id: 'addon',
      label: 'Human Add-on',
      icon: '✍',
      count: state.auditTrail.addons.length,
    },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn(
        'rounded-2xl border overflow-hidden',
        isGovern
          ? 'border-blue-500/15 bg-blue-950/20'
          : 'border-white/[0.06] bg-white/[0.02]',
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📜</span>
          <h3 className="text-xs font-semibold text-white/80">Semantic Audit Trail</h3>
          <span className="text-[9px] font-mono text-white/30">
            {state.auditTrail.events.length} events
          </span>
        </div>
        <AuditChainVerifier />
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 px-4 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all',
              activeTab === tab.id
                ? isGovern
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/[0.08] text-white/80 border border-white/[0.12]'
                : 'text-white/40 hover:text-white/60 border border-transparent',
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="text-[9px] font-mono opacity-60">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="px-4 pb-4"
        >
          {activeTab === 'deterministic' && <DeterministicLogPane />}
          {activeTab === 'translation' && <GenAiTranslationPane />}
          {activeTab === 'addon' && <HumanAddonEditor />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
