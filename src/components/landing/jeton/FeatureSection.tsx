import { motion } from 'framer-motion';
import {
  Scale,
  Shield,
  TrendingUp,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  JETON_COPY,
  JETON_FEATURES,
  type JetonFeatureItem,
} from '@/content/landing-copy-jeton';
import SpotlightCard from './effects/SpotlightCard';
import { JETON_EASING } from './jeton-config';

const ICONS: Record<JetonFeatureItem['name'], LucideIcon> = {
  Protect: Shield,
  Grow: TrendingUp,
  Execute: Zap,
  Govern: Scale,
};

const TONE_CLASS: Record<JetonFeatureItem['tone'], string> = {
  protect: 'text-emerald-300',
  grow: 'text-fuchsia-300',
  execute: 'text-amber-300',
  govern: 'text-sky-300',
};

export function FeatureSection() {
  return (
    <section className="bg-[#0B1221] px-6 pb-32 pt-28 text-white md:px-8 md:pb-40 md:pt-36">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.58, ease: JETON_EASING }}
          className="text-xs font-medium tracking-[0.3em] text-white/55"
        >
          {JETON_COPY.valueProp.eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.12, ease: JETON_EASING }}
          className="mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.1] tracking-[-0.03em] md:text-6xl"
        >
          {JETON_COPY.valueProp.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.62, delay: 0.24, ease: JETON_EASING }}
          className="mt-6 max-w-3xl text-pretty text-base leading-[1.65] tracking-[0.01em] text-white/72 md:text-lg"
        >
          {JETON_COPY.valueProp.body}
        </motion.p>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {JETON_FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.name];
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.66,
                  delay: 0.05 + index * 0.06,
                  ease: JETON_EASING,
                }}
                className={feature.wide ? 'md:col-span-2' : ''}
              >
                <SpotlightCard glowTone={feature.tone} className="h-full p-8 md:p-10">
                  <div className="flex h-full flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05]">
                        <Icon className={`h-6 w-6 ${TONE_CLASS[feature.tone]}`} aria-hidden="true" />
                      </span>
                      <span className="rounded-full border border-white/14 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/62">
                        {feature.confidence}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-white">
                      {feature.name}
                    </h3>
                    <p className="text-sm leading-[1.65] tracking-[0.01em] text-white/68 md:text-base">
                      {feature.description}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
