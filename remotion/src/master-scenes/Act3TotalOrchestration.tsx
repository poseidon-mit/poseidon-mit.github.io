import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Simple representation of an Audit Log row
const AuditRow: React.FC<{ index: number; frame: number }> = ({ index, frame }) => {
    const { fps } = useVideoConfig();
    // Drop in cascade
    const drop = spring({ frame: frame - (index * 2), fps, config: { damping: 20 } });
    const yOffset = interpolate(drop, [0, 1], [40, 0]);

    if (frame < index * 2) return null;

    return (
        <div style={{
            display: 'flex', gap: 24,
            padding: '12px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            opacity: drop,
            transform: `translateY(${yOffset}px)`,
            fontFamily: 'monospace',
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)'
        }}>
            <span style={{ color: '#00F0FF' }}>2026-02-19T{10 + (index % 12)}:{15 + index}:00Z</span>
            <span style={{ color: '#8B5CF6' }}>SYS_ACT_{8900 + index}</span>
            <span>Autonomous Portfolio Rebalance executed.</span>
            <span style={{ marginLeft: 'auto', color: '#3B82F6' }}>[✓ VERIFIED]</span>
        </div>
    );
}

export const Act3TotalOrchestration: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Timing: 14.5s - 23.0s (435 - 690f) => Duration: 255 frames
    // Grow Synthesis: 0 - 120f
    // Govern Audit Stream: 120 - 255f

    // 1. Grow Section Draw
    const drawProgress = interpolate(frame, [15, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const growSpring = spring({ frame: frame - 75, fps, config: { damping: 12, stiffness: 120 } });
    const projectedReturn = Math.max(0, interpolate(growSpring, [0, 1], [0, 18.4])).toFixed(1);

    // 2. Camera Tilt Up to Govern
    const tiltProgress = spring({ frame: frame - 120, fps, config: { damping: 15, stiffness: 60 } });
    const viewY = interpolate(tiltProgress, [0, 1], [0, -1080]); // Slide entire canvas up to reveal next section below it

    // 3. Govern Focus Pull
    const governZoom = spring({ frame: frame - 180, fps, config: { damping: 15, stiffness: 60 } });
    const gScale = interpolate(governZoom, [0, 1], [1, 1.8]);
    const gTranslateY = interpolate(governZoom, [0, 1], [0, 150]); // Center a specific row

    return (
        <AbsoluteFill style={{ backgroundColor: '#050508', overflow: 'hidden' }}>

            <AbsoluteFill style={{ transform: `translateY(${viewY}px)` }}>

                {/* TOP SECTION: GROW (Violet) */}
                <div style={{ height: 1080, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                    <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.08) 0%, transparent 60%)' }} />

                    <div style={{ width: 1000, color: '#fff', fontFamily: '-apple-system, sans-serif' }}>
                        <div style={{ fontSize: 24, color: '#8B5CF6', fontWeight: 600, letterSpacing: 2 }}>GROW ENGINE</div>
                        <div style={{ height: 400, borderBottom: '2px solid rgba(139, 92, 246, 0.4)', position: 'relative', marginTop: 64 }}>

                            {/* Animated Area Chart using SVG */}
                            <svg width="1000" height="400" viewBox="0 0 1000 400" style={{ position: 'absolute', bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,400 L0,300 Q200,320 400,200 T800,100 L1000,50 L1000,400 Z"
                                    fill="url(#violetGrad)"
                                    style={{ transform: `scaleX(${drawProgress})`, transformOrigin: '0 0' }}
                                />
                                <path
                                    d="M0,300 Q200,320 400,200 T800,100 L1000,50"
                                    fill="none" stroke="#8B5CF6" strokeWidth="4"
                                    strokeDasharray="1500"
                                    strokeDashoffset={1500 * (1 - drawProgress)}
                                />
                            </svg>

                            {/* Data Point Pops up */}
                            <div style={{
                                position: 'absolute', right: 0, top: 10,
                                transform: `scale(${growSpring})`,
                                transformOrigin: 'bottom right',
                                background: 'rgba(5,5,8,0.8)', padding: '16px 32px', borderRadius: 12, border: '1px solid #8B5CF6',
                                boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)'
                            }}>
                                <div style={{ color: '#888', fontSize: 14, letterSpacing: 1 }}>PROJECTED RETURN</div>
                                <div style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>+{projectedReturn}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: GOVERN (Blue) */}
                <div style={{ height: 1080, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, transparent 60%)' }} />

                    <div style={{
                        width: 1200, height: 600, background: 'rgba(5,5,8,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, overflow: 'hidden',
                        transform: `scale(${gScale}) translateY(${gTranslateY}px)`, transformOrigin: 'center center'
                    }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.1)' }}>
                            <span style={{ color: '#3B82F6', fontWeight: 600, letterSpacing: 2 }}>IMMUTABLE AUDIT LOG</span>
                        </div>
                        <div style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <AuditRow key={i} index={i} frame={Math.max(0, frame - 120)} />
                            ))}
                        </div>
                    </div>
                </div>

            </AbsoluteFill>
        </AbsoluteFill>
    );
};
