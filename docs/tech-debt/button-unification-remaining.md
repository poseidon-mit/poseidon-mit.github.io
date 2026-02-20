# Button Unification Remaining Work

Last generated: 2026-02-19 22:51:28 EST

This file tracks remaining native button usage after the first pass of Dashboard-style button standardization.

## Remaining native buttons (non-v2/v3/preview)

```text
src/pages/GovernAuditLedger.tsx:166:                <button key={f.label} role="tab" aria-selected={isActive} onClick={() => setActiveFilter(f.label)} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer" style={{ background: isActive ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)", color: isActive ? "var(--engine-govern)" : "#94A3B8", border: isActive ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent", minHeight: "44px" }}>
src/pages/GovernAuditLedger.tsx:292:              <button disabled className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium cursor-not-allowed opacity-60" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#CBD5E1", background: "transparent", minHeight: "44px" }} aria-label="Export full ledger preview only">
src/pages/GovernAuditLedger.tsx:295:              <button disabled className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium cursor-not-allowed opacity-60" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#CBD5E1", background: "transparent", minHeight: "44px" }} aria-label="Generate compliance report preview only">
src/pages/DesignSystemTokensMotion.tsx:52:                <button type="button" onClick={() => play(d.label)}
src/pages/GrowRecommendations.tsx:195:              <button
src/pages/GrowRecommendations.tsx:207:              <button
src/pages/GrowRecommendations.tsx:263:                <button
src/pages/GrowRecommendations.tsx:305:                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--engine-grow)' }}>
src/pages/GrowRecommendations.tsx:309:                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">
src/pages/GovernPolicy.tsx:118:                    <button onClick={() => setExpanded(expanded === p.name ? null : p.name)} className="flex items-center gap-1 mt-2 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
src/pages/GovernPolicy.tsx:131:                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 transition-colors">
src/pages/GovernPolicy.tsx:134:                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:bg-white/5 transition-colors">
src/pages/GovernPolicy.tsx:143:                <button onClick={() => setShowAll(true)} className="text-sm font-medium hover:opacity-80 transition-opacity text-center py-2" style={{ color: 'var(--engine-govern)' }}>
src/pages/GovernPolicy.tsx:186:              <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--engine-govern)' }}>
src/pages/ProtectDispute.tsx:227:                  <button className="text-xs font-medium hover:underline" style={{ color: 'var(--engine-protect)' }}>Regenerate</button>
src/pages/ProtectDispute.tsx:228:                  <button className="text-xs text-white/40 hover:text-white/60">Edit manually</button>
src/pages/ProtectDispute.tsx:276:                <button
src/pages/ProtectDispute.tsx:283:                <button
src/pages/GovernTrust.tsx:247:                        <button
src/pages/GovernTrust.tsx:264:              <button
src/pages/GovernTrust.tsx:270:              <button
src/pages/execute/ExecuteGlance.tsx:33:        <button
src/pages/execute/ExecuteGlance.tsx:40:        <button
src/pages/execute/ExecuteHero.tsx:84:          <button
src/pages/execute/ExecuteHero.tsx:96:          <button
src/pages/execute/ExecuteHero.tsx:105:          <button
src/pages/execute/ActionQueue.tsx:153:                            <button
src/pages/execute/ActionQueue.tsx:168:                            <button
src/pages/execute/ActionQueue.tsx:233:                <button
src/pages/execute/ActionQueue.tsx:246:                <button
src/pages/ExecuteApproval.tsx:172:            <button
src/pages/ExecuteApproval.tsx:207:                      <button
src/pages/ExecuteApproval.tsx:275:                        <button
src/pages/ExecuteApproval.tsx:282:                        <button
src/pages/ExecuteApproval.tsx:286:                        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 transition-colors">Defer</button>
src/pages/ExecuteApproval.tsx:372:              <button className="text-xs mt-2 hover:underline" style={{ color: 'var(--engine-execute)' }}>Show completed</button>
src/pages/ExecuteApproval.tsx:419:                  <button
src/pages/ExecuteApproval.tsx:429:                  <button
src/pages/govern/DecisionLedger.tsx:82:                      <button
src/pages/govern/DecisionLedger.tsx:113:                      <button
src/pages/govern/DecisionLedger.tsx:145:              <button
src/pages/govern/DecisionLedger.tsx:179:              <button
src/pages/govern/GovernHero.tsx:82:          <button
src/pages/govern/GovernHero.tsx:95:          <button
src/pages/HelpSupport.tsx:87:            <button key={ql.title} disabled className="surface-glass rounded-2xl p-4 text-left opacity-60 cursor-not-allowed">
src/pages/HelpSupport.tsx:108:                <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full text-left flex items-center justify-between p-4">
src/pages/HelpSupport.tsx:117:                      <button onClick={() => setHelpful({ ...helpful, [idx]: true })} className={`p-1 rounded ${helpful[idx] === true ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/30 hover:text-white/50'}`}>
src/pages/HelpSupport.tsx:120:                      <button onClick={() => setHelpful({ ...helpful, [idx]: false })} className={`p-1 rounded ${helpful[idx] === false ? 'bg-red-500/20 text-red-400' : 'text-white/30 hover:text-white/50'}`}>
src/pages/HelpSupport.tsx:136:              <button key={dl.title} disabled className="surface-glass rounded-2xl p-4 text-left opacity-60 cursor-not-allowed">
src/pages/HelpSupport.tsx:183:              <button disabled className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white opacity-60 cursor-not-allowed" style={{ background: 'var(--engine-govern)' }} aria-label="Submit ticket preview only">
src/pages/GovernRegistry.tsx:144:                              <button className="flex items-center gap-1.5 mt-3 text-xs font-medium hover:opacity-80 transition-opacity" style={{ color: 'var(--engine-govern)' }}>
src/pages/Login.tsx:110:                <button
src/pages/OnboardingConsent.tsx:83:                  <button
src/pages/Pricing.tsx:138:            <button
src/pages/SettingsAI.tsx:131:                    <button
src/pages/SettingsAI.tsx:160:                  <button key={v} onClick={() => { setVerbosity(v); setDirty(true); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${verbosity === v ? 'text-cyan-300 border-cyan-500/40' : 'text-white/50 border-white/10 bg-white/5 hover:bg-white/10'}`} style={verbosity === v ? { background: 'rgba(0,240,255,0.15)' } : {}} aria-pressed={verbosity === v} aria-label={`Set verbosity to ${v}`} aria-labelledby="settings-ai-verbosity-label">
src/pages/SettingsAI.tsx:174:                  <button onClick={() => { t.setter(!t.state); setDirty(true); }} className={`w-9 h-5 rounded-full relative transition-colors ${t.state ? 'bg-cyan-500' : 'bg-white/10'}`} role="switch" aria-checked={t.state} aria-label={t.label}>
src/pages/SettingsAI.tsx:198:              <button onClick={() => setDirty(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">
src/pages/SettingsAI.tsx:201:              <button onClick={() => setDirty(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity" style={{ background: 'var(--engine-grow)' }}>
src/pages/SettingsRights.tsx:161:                <button onClick={() => setExpandedInventory(expandedInventory === item.category ? null : item.category)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
src/pages/SettingsRights.tsx:203:                <button
src/pages/DesignSystemLanding.tsx:48:            <button
src/pages/ExecuteHistory.tsx:116:                <button
src/pages/GrowScenarios.tsx:116:            <motion.button
src/pages/protect/ThreatTable.tsx:174:                      <button
src/pages/protect/ThreatTable.tsx:243:                  <button
src/pages/ProtectAlertDetail.tsx:173:                        <button className="w-full flex items-center justify-between p-4 cursor-pointer text-left" style={{ background: "transparent", border: "none" }} onClick={() => setExpandedId(expanded ? null : item.id)} aria-expanded={expanded} aria-label={`${item.title}: score ${(item.score * 100).toFixed(0)}%`}>
src/pages/grow/GrowHero.tsx:75:          <button
src/pages/grow/GrowHero.tsx:88:          <button
src/pages/Settings.tsx:33:      <button
src/pages/Settings.tsx:178:                <button
src/pages/ActivityTimelinePage.tsx:160:                  <button
src/pages/grow/GoalsSection.tsx:122:            <button
src/pages/SettingsIntegrations.tsx:119:                    <button onClick={() => handleSync(acct.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 transition-colors">
src/pages/SettingsIntegrations.tsx:125:                        <button onClick={() => setDisconnecting(null)} className="text-xs text-white/40 hover:text-white/60">Cancel</button>
src/pages/SettingsIntegrations.tsx:126:                        <button className="text-xs text-red-400 hover:text-red-300">Yes, disconnect</button>
src/pages/SettingsIntegrations.tsx:129:                      <button onClick={() => setDisconnecting(acct.id)} className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
src/pages/SettingsIntegrations.tsx:145:                  <button key={t.id} disabled className="surface-glass rounded-2xl p-4 text-left opacity-60 cursor-not-allowed">
```
