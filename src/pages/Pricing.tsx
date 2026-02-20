import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Shield, TrendingUp, ChevronDown } from "lucide-react";
import { PublicTopBar } from '@/components/landing/PublicTopBar';
import { Button, ButtonLink, Toggle, Surface } from '@/design-system';
import {
  creatorStudioFadeUp as fadeUp,
  creatorStudioStaggerContainer as staggerContainer,
} from '@/lib/motion-presets';

/* ── Plan data ── */
const PLANS = [
{
  name: "Starter",
  price: { monthly: 0, annual: 0 },
  description: "For individuals exploring AI-powered finance",
  features: [
  "1 connected account",
  "Basic threat detection",
  "Weekly digest",
  "Community support",
  "Standard dashboards"],

  cta: "Get started free",
  highlight: false
},
{
  name: "Pro",
  price: { monthly: 29, annual: 24 },
  description: "For users who want full protection and growth",
  features: [
  "Unlimited accounts",
  "Real-time threat detection",
  "Scenario modeling",
  "Priority support",
  "Custom dashboards",
  "Full audit ledger",
  "Execute automation"],

  cta: "Create account",
  highlight: true
},
{
  name: "Enterprise",
  price: { monthly: null, annual: null },
  description: "For teams requiring compliance and governance",
  features: [
  "Everything in Pro",
  "SSO & team management",
  "Dedicated support",
  "SLA guarantee",
  "Custom integrations",
  "Compliance reporting",
  "On-premise option"],

  cta: "Contact sales",
  highlight: false
}];


const FAQ_ITEMS = [
{
  q: "How does the free trial work?",
  a: "Start with the Starter plan at no cost. Upgrade anytime to unlock real-time protection, scenario modeling, and full audit capabilities."
},
{
  q: "Can I switch plans later?",
  a: "Yes. You can upgrade, downgrade, or cancel at any time. Changes take effect at the next billing cycle."
},
{
  q: "Is my financial data secure?",
  a: "Absolutely. We use bank-level encryption, read-only data access, and every AI decision is fully auditable through the Govern engine."
},
{
  q: "What happens when I cancel?",
  a: "Your data remains accessible for 30 days. You can export everything, and no further charges apply."
}];


export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <PublicTopBar />
      <motion.main
        id="main-content"
        role="main"
        className="app-bg-oled relative min-h-screen text-slate-100"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
      <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-[var(--engine-dashboard)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950">
          
        Skip to main content
      </a>
      {/* Background */}
      <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(0,240,255,0.04),transparent)]"
          aria-hidden="true" />
        

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        {/* ── P1: Hero ── */}
        <motion.section
            className="text-center mb-16"
            variants={staggerContainer}>
            
          <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--engine-dashboard)" }}>
              
            Simple, transparent pricing
          </motion.p>
          <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4 text-balance"
              style={{ color: "#F1F5F9" }}>
              
            Choose your level of{" "}
            <span style={{ color: "var(--engine-dashboard)" }}>protection</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#94A3B8" }}>
            Every plan includes explainable AI decisions, full audit trails, and the ability to reverse any action.
          </motion.p>

          {/* Annual/Monthly toggle */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-8">
            <span className="text-sm" style={{ color: annual ? "#64748B" : "#F1F5F9" }}>Monthly</span>
            <Toggle checked={annual} onChange={setAnnual} ariaLabel={`Switch to ${annual ? "monthly" : "annual"} billing`} />
            <span className="text-sm" style={{ color: annual ? "#F1F5F9" : "#64748B" }}>
              Annual
              <span className="ml-1 text-xs font-semibold" style={{ color: "var(--state-healthy)" }}>
                Save 17%
              </span>
            </span>
          </motion.div>
        </motion.section>

        {/* ── P2: Plan cards ── */}
        <motion.section
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
            variants={staggerContainer}>
            
          {PLANS.map((plan) => <Surface

              key={plan.name}
              variants={fadeUp} className="rounded-2xl flex flex-col relative"

              style={{
                border: plan.highlight ?
                "1px solid rgba(0,240,255,0.3)" :
                "1px solid rgba(255,255,255,0.06)"
              }} variant="glass" padding="md" as={motion.div}>
              
              {plan.highlight &&
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  background: "var(--engine-dashboard)",
                  color: 'var(--bg-oled)'
                }}>
                
                  Most Popular
                </span>
              }

              <h3 className="text-lg font-bold mb-1" style={{ color: "#F1F5F9" }}>{plan.name}</h3>
              <p className="text-sm mb-4" style={{ color: "#64748B" }}>{plan.description}</p>

              <div className="mb-6">
                {plan.price.monthly !== null ?
                <>
                    <span className="text-4xl font-bold font-mono" style={{ color: "#F1F5F9" }}>
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-sm ml-1" style={{ color: "#64748B" }}>/month</span>
                  </> :

                <span className="text-2xl font-bold" style={{ color: "#F1F5F9" }}>Custom</span>
                }
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) =>
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "#CBD5E1" }}>
                    <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--state-healthy)" }} />
                    {f}
                  </li>
                )}
              </ul>

              <ButtonLink
                to={plan.price.monthly === null ? "mailto:team@poseidon-ai.com" : "/signup"}
                variant={plan.highlight ? 'glass' : 'secondary'}
                engine="dashboard"
                className="w-full rounded-xl text-sm">
                
                {plan.cta}
              </ButtonLink>
            </Surface>
            )}
        </motion.section>

        {/* ── P3: FAQ ── */}
        <motion.section
            className="max-w-3xl mx-auto mb-16"
            variants={staggerContainer}>
            
          <motion.h2
              variants={fadeUp}
              className="text-2xl font-bold text-center mb-8"
              style={{ color: "#F1F5F9" }}>
              
            Frequently asked questions
          </motion.h2>

          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, i) => <Surface

                key={i}
                variants={fadeUp} className="rounded-xl overflow-hidden" variant="glass" padding="none" data-surface-role="structure" as={motion.div}>

                
                <Button
                  className="w-full flex items-center justify-between p-4 text-left"
                  variant="ghost"
                  engine="dashboard"
                  springPress={false}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}>
                  
                  <span className="text-sm font-medium" style={{ color: "#F1F5F9" }}>{item.q}</span>
                  <ChevronDown
                    size={16}
                    className="flex-shrink-0 transition-transform"
                    style={{
                      color: "#64748B",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)"
                    }} />
                  
                </Button>
                {openFaq === i &&
                <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{item.a}</p>
                  </div>
                }
              </Surface>
              )}
          </div>
        </motion.section>

        {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 flex-wrap text-[10px] font-mono uppercase tracking-widest" style={{ color: "#475569" }}>
          <span className="flex items-center gap-1.5"><Shield size={12} /> Bank-level encryption</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span className="flex items-center gap-1.5"><TrendingUp size={12} /> Explainable AI</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span className="flex items-center gap-1.5"><Zap size={12} /> Reversible actions</span>
        </div>
      </div>
      </motion.main>
    </>);

}
