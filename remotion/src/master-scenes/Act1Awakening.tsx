import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// UI Primitives for the Dashboard
const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <div style={{
        background: 'rgba(5, 5, 8, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 240, 255, 0.15)', // Dashboard Cyan accent
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        padding: 32,
        color: '#fff',
        fontFamily: '-apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        ...style
    }}>
        {children}
    </div>
);

export const Act1Awakening: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Timing: 0 to 7 seconds = 210 frames
    // The Arrival: 0 - 2s (0 - 60f)
    // Cascading Load: 2s - 4.5s (60 - 135f)
    // The Macro Dive: 4.5s - 7s (135 - 210f)

    // -- 1. The Arrival (MacBook) --
    // We approximate the 3D MacBook with a heavy scaled/rotated container for now
    const arriveSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80, mass: 2 } });
    const macScale = interpolate(arriveSpring, [0, 1], [0.5, 1]);
    const macRotX = interpolate(arriveSpring, [0, 1], [30, 0]); // Pitch forward to flat

    // -- 2. Cascading Load --
    const loadSidebar = spring({ frame: frame - 60, fps, config: { damping: 200 } });
    const loadHeader = spring({ frame: frame - 64, fps, config: { damping: 200 } });
    const loadChart = spring({ frame: frame - 68, fps, config: { damping: 200 } });
    const loadCard1 = spring({ frame: frame - 72, fps, config: { damping: 200 } });
    const loadCard2 = spring({ frame: frame - 76, fps, config: { damping: 200 } });

    // -- 3. The Macro Dive --
    // Violent exponential zoom into the card
    const diveProgress = Math.pow(Math.max(0, interpolate(frame, [135, 165], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })), 3);
    const diveScale = interpolate(diveProgress, [0, 1], [1, 28]);
    // Offset to center the number "23" in the second card
    const diveTranslateX = interpolate(diveProgress, [0, 1], [0, -32]); // Percent
    const diveTranslateY = interpolate(diveProgress, [0, 1], [0, -12]); // Percent

    // -- 4. Synchronized Spring Physics (The Number) --
    // Triggers exactly as the dive hits its peak (frame 165)
    const numberSpring = spring({ frame: frame - 165, fps, config: { damping: 12, stiffness: 180 } });
    const threatCount = Math.floor(interpolate(numberSpring, [0, 1], [0, 23]));

    // Neon flash on impact
    const flash = interpolate(frame, [165, 175, 190], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#050508', perspective: 1200, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>

            {/* Background radial cyan bloom */}
            <div style={{
                position: 'absolute',
                width: '100%', height: '100%',
                background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.05) 0%, transparent 70%)',
                opacity: interpolate(frame, [45, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }} />

            {/* The Master Container (simulates the MacBook screen) */}
            <AbsoluteFill style={{
                transform: `scale(${macScale * diveScale}) rotateX(${macRotX}deg) translate(${diveTranslateX}%, ${diveTranslateY}%)`,
                transformStyle: 'preserve-3d',
                justifyContent: 'center',
                alignItems: 'center',
            }}>

                {/* Screen Bezel boundaries */}
                <div style={{
                    width: 1440, height: 900,
                    background: '#0a0a0c',
                    borderRadius: 16,
                    boxShadow: '0 0 100px rgba(0,240,255,0.1)',
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr',
                    gridTemplateRows: '80px 1fr',
                    overflow: 'hidden',
                    position: 'relative'
                }}>

                    {/* Sidebar */}
                    <div style={{
                        gridRow: '1 / 3', gridColumn: '1 / 2',
                        background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)',
                        transform: `translateX(${interpolate(loadSidebar, [0, 1], [-240, 0])}px)`,
                        opacity: loadSidebar
                    }} />

                    {/* Header */}
                    <div style={{
                        gridRow: '1 / 2', gridColumn: '2 / 3',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', padding: '0 32px',
                        transform: `translateY(${interpolate(loadHeader, [0, 1], [-80, 0])}px)`,
                        opacity: loadHeader
                    }}>
                        <span style={{ color: '#00F0FF', fontWeight: 700, letterSpacing: 2, fontSize: 24 }}>POSEIDON.AI</span>
                    </div>

                    {/* Main Content Area */}
                    <div style={{ gridRow: '2 / 3', gridColumn: '2 / 3', padding: 32, display: 'flex', gap: 32 }}>

                        {/* Chart Area */}
                        <GlassCard style={{ flex: 2, transform: `translateY(${interpolate(loadChart, [0, 1], [40, 0])}px)`, opacity: loadChart }}>
                            <div style={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, fontSize: 14 }}>Net Worth Prediction</div>
                            <div style={{ width: '100%', flex: 1, borderBottom: '2px solid #00F0FF', marginTop: 40, position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,240,255,0.2), transparent)' }} />
                            </div>
                        </GlassCard>

                        {/* Right KPI Cards */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
                            <GlassCard style={{ flex: 1, transform: `translateX(${interpolate(loadCard1, [0, 1], [40, 0])}px)`, opacity: loadCard1 }}>
                                <div style={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, fontSize: 14 }}>System Load</div>
                                <div style={{ fontSize: 64, fontWeight: 300, color: '#fff', marginTop: 'auto' }}>12%</div>
                            </GlassCard>

                            {/* Target for Macro Dive: Active Threats */}
                            <GlassCard style={{ flex: 1, transform: `translateX(${interpolate(loadCard2, [0, 1], [40, 0])}px)`, opacity: loadCard2, boxShadow: `0 0 ${flash * 60}px rgba(255,0,0,${flash * 0.5})` }}>
                                <div style={{ color: flash > 0 ? '#ff4444' : '#888', textTransform: 'uppercase', letterSpacing: 1, fontSize: 14 }}>Active Threats</div>
                                <div style={{
                                    fontSize: 64,
                                    fontWeight: 700,
                                    marginTop: 'auto',
                                    color: flash > 0 ? '#ff4444' : '#00F0FF',
                                    textShadow: `0 0 ${flash * 40}px #ff4444`
                                }}>
                                    {threatCount}
                                </div>
                            </GlassCard>
                        </div>

                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
