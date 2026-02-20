import React from 'react';
import { AbsoluteFill, Sequence, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// UI Primitives
const GlassCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <div style={{
        background: 'rgba(25, 25, 25, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(0,0,0,0.8)',
        padding: 32,
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        ...style
    }}>
        {children}
    </div>
);

// Shot 1: The Macro Dive
const MacroDive: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Exponential zoom from 1 to 10
    const scale = spring({
        frame: frame - 15, // Wait half a second before zooming
        fps,
        config: { damping: 200, mass: 1, stiffness: 50 },
    });

    const zoom = interpolate(scale, [0, 1], [1, 25]);

    // Number tick up
    const numberProgress = spring({
        frame: frame - 45, // Start ticking right as zoom lands
        fps,
        config: { damping: 15, stiffness: 80 }
    });
    const currentStat = Math.floor(interpolate(numberProgress, [0, 1], [0, 847])) + ",000";

    return (
        <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <AbsoluteFill style={{
                transform: `scale(${zoom})`,
                transformOrigin: '38% 50%', // Focus specifically on the number of the left card
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <GlassCard style={{ width: 400, height: 250 }}>
                        <h3 style={{ margin: 0, opacity: 0.6, fontSize: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Active Threats</h3>
                        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 'auto', background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {currentStat}
                        </div>
                    </GlassCard>
                    <GlassCard style={{ width: 400, height: 250 }}>
                        <h3 style={{ margin: 0, opacity: 0.6, fontSize: 18, textTransform: 'uppercase', letterSpacing: 1 }}>System Load</h3>
                        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 'auto', color: '#fff' }}>12%</div>
                    </GlassCard>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// Shot 2: 3D Z-Space Stack
const ZSpaceStack: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Floating effect
    const rotX = interpolate(frame, [0, 150], [45, 60]);
    const rotZ = interpolate(frame, [0, 150], [-20, -10]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#000', perspective: 1200, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(1.5)`,
                transformStyle: 'preserve-3d',
                position: 'relative',
                width: 600,
                height: 600
            }}>
                {[0, 1, 2].map((i) => {
                    // Top card pops out
                    const isTop = i === 2;
                    const pop = isTop ? spring({
                        frame: frame - 45,
                        fps,
                        config: { damping: 12, stiffness: 100 }
                    }) : 0;

                    const zOffset = i * -80 + (pop * 200);
                    const shadow = isTop ? interpolate(pop, [0, 1], [40, 160]) : 40;

                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            top: i * 40,
                            left: i * -40,
                            width: '100%',
                            background: isTop ? 'rgba(20, 30, 20, 0.8)' : 'rgba(25, 25, 25, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${isTop ? `rgba(0, 255, 100, ${interpolate(pop, [0, 1], [0.2, 0.8])})` : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: 24,
                            padding: 32,
                            transform: `translateZ(${zOffset}px)`,
                            boxShadow: `0 ${shadow}px ${shadow}px rgba(0,0,0,0.9)`,
                            color: '#fff',
                            fontFamily: '-apple-system, sans-serif'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: isTop ? '#0f0' : '#888', letterSpacing: 2 }}>{isTop ? 'EXECUTING' : 'QUEUED'}</h4>
                                    <h2 style={{ margin: '8px 0 0 0', fontSize: 32 }}>Re-route Pipeline Alpha</h2>
                                </div>
                                {isTop && (
                                    <div style={{
                                        opacity: pop,
                                        width: 48, height: 48, borderRadius: 24, background: '#0f0',
                                        boxShadow: '0 0 30px #0f0',
                                        transform: `scale(${pop})`
                                    }} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};

// Shot 3: Depth of Field & Micro Interactions
const DepthOfField: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Focus pull
    const blur = interpolate(frame, [0, 45], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const scale = interpolate(frame, [0, 45], [1.1, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    // Press animation
    const press = spring({
        frame: frame - 60,
        fps,
        config: { damping: 12, stiffness: 200 }
    });

    // Release animation
    const release = spring({
        frame: frame - 75,
        fps,
        config: { damping: 12, stiffness: 150 }
    });

    const buttonScale = 1 - (press * 0.05) + (release * 0.05);

    // Ripple
    const ripple = spring({
        frame: frame - 70,
        fps,
        config: { damping: 30, stiffness: 40 }
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', gap: 60 }}>
            {/* Background Element (Starts blurred, comes into focus) */}
            <h1 style={{
                color: '#fff',
                fontFamily: '-apple-system, sans-serif',
                fontSize: 56,
                fontWeight: 300,
                filter: `blur(${blur}px)`,
                transform: `scale(${scale})`,
                letterSpacing: -1
            }}>
                Optical Depth & Micro-Interactions
            </h1>

            <div style={{ position: 'relative' }}>
                {/* Ripple Effect */}
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    width: 0, height: 0,
                    boxShadow: `0 0 0 ${ripple * 150}px rgba(255, 255, 255, ${Math.max(0, 0.2 - ripple)})`,
                    borderRadius: '50%',
                }} />

                {/* The Action Button */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '24px 64px',
                    borderRadius: 60,
                    color: '#fff',
                    fontFamily: '-apple-system, sans-serif',
                    fontSize: 28,
                    fontWeight: 600,
                    transform: `scale(${buttonScale})`,
                    boxShadow: `0 ${(1 - press) * 10}px ${(1 - press) * 30}px rgba(0,0,0,0.5)`,
                    cursor: 'pointer'
                }}>
                    Simulate Click
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const AppleCapabilitiesDemo: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <Sequence from={0} durationInFrames={150}>
                <MacroDive />
            </Sequence>
            <Sequence from={150} durationInFrames={150}>
                <ZSpaceStack />
            </Sequence>
            <Sequence from={300} durationInFrames={150}>
                <DepthOfField />
            </Sequence>
        </AbsoluteFill>
    );
};
