import { motion } from 'framer-motion';
import { Shield, ExternalLink } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
};

export function GovernFooter() {
  return (
    <motion.footer
      className="govern-footer glass-surface"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      role="contentinfo"
      aria-label="Governance verification"
    >
      <div className="govern-footer__badge">
        <Shield size={14} style={{ color: 'var(--engine-govern)' }} />
        <span>Verified</span>
      </div>

      <a href="/govern/audit" className="govern-footer__audit-link">
        <ExternalLink size={12} />
        GV-2026-0215-DASH
      </a>

      <button className="govern-footer__cta" type="button">
        Request human review
      </button>
    </motion.footer>
  );
}
