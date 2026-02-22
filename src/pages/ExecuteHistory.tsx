import React from 'react';
import { motion } from 'framer-motion';
import { getMotionPreset } from '@/lib/motion-presets';
import { cn } from '@/lib/utils';
import { History, ArrowLeft, Download, Filter } from 'lucide-react';
import { Link } from '@/router';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

export default function ExecuteHistoryPage() {
    const prefersReducedMotion = useReducedMotionSafe();
    const { fadeUp, staggerContainer } = getMotionPreset(prefersReducedMotion);

    const historyItems = [
        { id: 'EXE-2026-0319-001', action: 'TechElectro Store Block', amount: '$2,847', status: 'Completed', date: '2026-03-19' },
        { id: 'EXE-2026-0318-042', action: 'Subscription Cleanup', amount: '$420', status: 'Completed', date: '2026-03-18' },
    ];

    return (
        <div className="flex flex-col gap-8 w-full">
            <motion.section
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
            >
                <div className="flex items-center justify-between">
                    <Link to="/execute" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
                        <ArrowLeft size={16} />
                        Back to Queue
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                <motion.div variants={fadeUp}>
                    <h1 className="text-4xl font-light tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Execution History
                    </h1>
                    <p className="text-white/50">Audit log of all AI-automated financial actions.</p>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-col gap-4">
                    {historyItems.map((item) => (
                        <div key={item.id} className="p-6 rounded-[24px] border border-white/[0.08] bg-black/40 backdrop-blur-3xl flex items-center justify-between shadow-xl">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-white">{item.action}</span>
                                <span className="text-xs font-mono text-white/40">{item.id} • {item.date}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-white">{item.amount}</span>
                                <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.section>
        </div>
    );
}
