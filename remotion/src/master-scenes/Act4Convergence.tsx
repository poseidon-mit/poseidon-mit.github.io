import React from 'react';
import { AbsoluteFill, spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Simple Orbiting Node
const OrbitNode: React.FC<{ color: string; rotation: number; distance: number; scale: number; label: string }> = ({ color, rotation, distance, scale, label }) => {
    return (
        <div style={{
            position: 'absolute',
            width: 64, height: 64, borderRadius: 32,
            background: `linear-gradient(135deg, ${color}, rgba(5,5,8,0.8))`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 40px ${color}80, inset 0 0 20px ${color}40`,
            transform: `rotate(${rotation}deg) translateX(${distance}px) rotate(-${rotation}deg) scale(${scale})`,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{ color: '#fff', fontSize: 10, letterSpacing: 1, marginTop: 100, opacity: 0.6 }}>{label}</div>
        </div>
    );
};

export const Act4Convergence: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Timing: 23.0s - 30.0s (690 - 900f) => Duration: 210 frames
    // The Orbit: 0 - 120f
    // The Fade & Signature: 120 - 210f

    // 1. Constellation Orbit Entrance
    const engineEntrance = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 80 } });
    const orbitDistance = interpolate(engineEntrance, [0, 1], [0, 240]);
    const nodeScale = interpolate(engineEntrance, [0, 1], [0.1, 1]);

    // Orbit rotation
    const baseRotation = frame * 0.5;

    // 2. The Collapse
    const collapse = spring({ frame: frame - 105, fps, config: { damping: 20, stiffness: 100 } });
    const finalDistance = interpolate(collapse, [0, 1], [orbitDistance, 0]);
    const sceneOpacity = interpolate(collapse, [0, 1], [1, 0]);

    // 3. The Logo Reveal
    const logoReveal = spring({ frame: frame - 140, fps, config: { damping: 30, stiffness: 60 } });
    const logoScale = interpolate(logoReveal, [0, 1], [0.8, 1]);

    // 4. Final Fade Out
    const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#050508', justifyContent: 'center', alignItems: 'center', opacity: fadeOut }}>

            {/* 3D Hardware Constellation Scene */}
            <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: sceneOpacity }}>

                {/* Subtle background glow representing the MacBook screen behind them */}
                <div style={{ width: 800, height: 500, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', position: 'absolute', transform: 'scale(1.2)' }} />

                {/* 5 Engines */}
                <OrbitNode color="#00F0FF" rotation={baseRotation + 0} distance={finalDistance} scale={nodeScale} label="DASHBOARD" />
                <OrbitNode color="#22C55E" rotation={baseRotation + 72} distance={finalDistance} scale={nodeScale} label="PROTECT" />
                <OrbitNode color="#8B5CF6" rotation={baseRotation + 144} distance={finalDistance} scale={nodeScale} label="GROW" />
                <OrbitNode color="#EAB308" rotation={baseRotation + 216} distance={finalDistance} scale={nodeScale} label="EXECUTE" />
                <OrbitNode color="#3B82F6" rotation={baseRotation + 288} distance={finalDistance} scale={nodeScale} label="GOVERN" />

                {/* Connecting Lines could be added here via SVG, simplifed for now */}
                <div style={{ width: finalDistance * 2, height: finalDistance * 2, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.1)', position: 'absolute', transform: 'scale(1)' }} />
            </div>

            {/* The Final Signature */}
            <div style={{
                position: 'absolute',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                opacity: logoReveal,
                transform: `scale(${logoScale})`
            }}>
                <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: 8, color: '#fff', textShadow: '0 0 40px rgba(0, 240, 255, 0.5)' }}>
                    POSEIDON<span style={{ color: '#00F0FF' }}>.</span>AI
                </div>
                {/* Optical Light Ray passing through */}
                <div style={{ position: 'absolute', top: '50%', left: '-50%', width: '200%', height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.8), transparent)', transform: `translateX(${interpolate(frame, [140, 200], [-100, 100])}%)`, filter: 'blur(2px)' }} />

                <div style={{ fontSize: 14, color: '#666', letterSpacing: 4, marginTop: 40, opacity: interpolate(frame, [170, 190], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                    MIT SLOAN CAPSTONE 2026
                </div>
            </div>

        </AbsoluteFill>
    );
};
