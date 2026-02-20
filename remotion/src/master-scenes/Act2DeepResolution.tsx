import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

const GlassRow: React.FC<{ children: React.ReactNode; isFocus?: boolean; zDepth?: number; opacity?: number }> = ({ children, isFocus, zDepth = 0, opacity = 1 }) => (
    <div style={{
        background: isFocus ? 'rgba(34, 197, 94, 0.15)' : 'rgba(5, 5, 8, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isFocus ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.05)'}`,
        borderRadius: 16,
        padding: '24px 32px',
        color: '#fff',
        fontFamily: '-apple-system, sans-serif',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 800,
        transform: `translateZ(${zDepth}px)`,
        opacity,
        boxShadow: isFocus ? '0 0 40px rgba(34, 197, 94, 0.3)' : '0 8px 32px rgba(0,0,0,0.5)',
        transition: 'all 0.1s'
    }}>
        {children}
    </div>
);

export const Act2DeepResolution: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Timing: 7.0s - 14.5s (210 - 435f) => Duration: 225 frames
    // The 3D Z-Space Stack: 0 - 105f
    // Cinematic Depth of Field & Micro-Interactions: 105 - 225f

    // 1. Z-Space Rotation
    const revealProgress = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 60 } });
    const rotY = interpolate(revealProgress, [0, 1], [0, -35]);

    // 2. The Pop Forward
    const popProgress = spring({ frame: frame - 60, fps, config: { damping: 12, stiffness: 120 } });
    const topZ = interpolate(popProgress, [0, 1], [0, 120]);

    // 3. Cinematic DoF Focus Pull
    const dofProgress = spring({ frame: frame - 105, fps, config: { damping: 20, stiffness: 80 } });
    const bgBlur = interpolate(dofProgress, [0, 1], [0, 16]); // Intense background blur

    // 4. Micro-Interaction (Button Press & Ripple)
    const pressProgress = spring({ frame: frame - 150, fps, config: { damping: 12, stiffness: 300 } });
    const releaseProgress = spring({ frame: frame - 156, fps, config: { damping: 12, stiffness: 200 } });
    const buttonScale = 1 - (pressProgress * 0.05) + (releaseProgress * 0.05);

    const rippleProgress = spring({ frame: frame - 156, fps, config: { damping: 30, stiffness: 60 } });

    // 5. Threat Resolved State
    const resolved = frame > 165;

    return (
        <AbsoluteFill style={{ backgroundColor: '#050508', perspective: 1200, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>

            {/* Background radial green bloom */}
            <div style={{
                position: 'absolute',
                width: '100%', height: '100%',
                background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
                opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }} />

            {/* Ripple Wave */}
            <div style={{
                position: 'absolute',
                width: rippleProgress * 1000, height: rippleProgress * 1000,
                borderRadius: '50%',
                border: '2px solid rgba(34, 197, 94, 0.8)',
                opacity: Math.max(0, 1 - (rippleProgress * 1.5)),
                boxShadow: '0 0 100px rgba(34, 197, 94, 0.5)'
            }} />

            <div style={{
                transform: `rotateY(${rotY}deg) translateX(${interpolate(dofProgress, [0, 1], [0, -100])}px) scale(${interpolate(dofProgress, [0, 1], [1, 1.2])})`,
                transformStyle: 'preserve-3d',
                position: 'relative'
            }}>

                {/* Background Stack (Blurs out) */}
                <div style={{ filter: `blur(${bgBlur}px)`, opacity: 1 - (bgBlur * 0.05) }}>
                    <GlassRow zDepth={-80} opacity={0.6}>
                        <div>
                            <div style={{ color: '#888', fontSize: 12, letterSpacing: 1 }}>THREAT ID: 8847</div>
                            <div style={{ fontSize: 20, marginTop: 4 }}>Suspicious Wire Transfer</div>
                        </div>
                        <div style={{ color: '#EAB308' }}>INVESTIGATING</div>
                    </GlassRow>

                    <div style={{ height: 24 }} />

                    <GlassRow zDepth={-40} opacity={0.8}>
                        <div>
                            <div style={{ color: '#888', fontSize: 12, letterSpacing: 1 }}>THREAT ID: 8848</div>
                            <div style={{ fontSize: 20, marginTop: 4 }}>Untrusted API Access</div>
                        </div>
                        <div style={{ color: '#EAB308' }}>INVESTIGATING</div>
                    </GlassRow>
                </div>

                <div style={{ height: 24 }} />

                {/* Foreground Action Item */}
                <GlassRow isFocus zDepth={topZ}>
                    <div>
                        <div style={{ color: resolved ? '#22C55E' : '#FF3B30', fontSize: 14, letterSpacing: 1, fontWeight: 700 }}>
                            {resolved ? '✓ NEUTRALIZATION COMPLETE' : 'CRITICAL THREAT: RANSOMWARE'}
                        </div>
                        <div style={{ fontSize: 32, marginTop: 8, fontWeight: 300, color: resolved ? 'rgba(255,255,255,0.7)' : '#fff' }}>
                            Lateral Movement Detected
                        </div>
                    </div>

                    {/* The Interactive Button */}
                    <div style={{
                        background: resolved ? 'transparent' : 'rgba(34, 197, 94, 0.2)',
                        border: `1px solid ${resolved ? 'rgba(34, 197, 94, 0.5)' : '#22C55E'}`,
                        color: '#22C55E', borderRadius: 8, padding: '12px 24px', fontWeight: 600,
                        transform: `scale(${buttonScale})`,
                        boxShadow: resolved ? 'none' : '0 0 20px rgba(34, 197, 94, 0.4)',
                        opacity: dofProgress > 0.5 ? 1 : 0.8 // Emphasize when in focus
                    }}>
                        {resolved ? 'RESOLVED' : 'NEUTRALIZE'}
                    </div>
                </GlassRow>

            </div>
        </AbsoluteFill>
    );
};
