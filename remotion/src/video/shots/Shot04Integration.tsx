
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../shared/animation/ShotTransition';
import { CameraController } from '../../shared/camera/CameraController';
import { theme } from '../../shared/theme';
import { SHOTS } from '../config';
import { AnimatedEnginePill, AnimatedCardReveal } from '../../shared/live-ui/AnimatedUI';
import { GlassRefraction } from '../../shared/cinematic/GlassRefraction';
import { protectSignal, growGoal, executeAction, governDecision } from '../../shared/data/real-data';

export const Shot04Integration: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Selected Data Points for display
    const protectData = protectSignal;
    const growData = growGoal;
    const executeData = executeAction;
    const governData = governDecision;

    const engines = [
        { name: 'Protect', color: theme.accent.red, data: protectData },
        { name: 'Grow', color: theme.accent.violet, data: growData },
        { name: 'Execute', color: theme.accent.amber, data: executeData },
        { name: 'Govern', color: theme.accent.blue, data: governData },
    ] as const;

    // Stacking Animation
    // 0-30: Pills stack up
    // 40-70: Expand to bars
    // 70+: Show data

    const expandProgress = spring({
        frame: frame - 40,
        fps,
        config: { damping: 15, mass: 1, stiffness: 80 }
    });

    const containerWidth = interpolate(expandProgress, [0, 1], [200, 900]);
    const containerHeight = interpolate(expandProgress, [0, 1], [60, 100]);

    return (
        <ShotTransition
            durationInFrames={SHOTS.shot4.duration}
            enterType="zoom-through"
            exitType="fade"
        >
            <CameraController keyframes={[{ frame: 0, scale: 1, x: 0, y: 0 }, { frame: 180, scale: 1.1, x: 0, y: 0 }]}>
                <AbsoluteFill style={{ background: theme.backgroundGradient }}>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        gap: 20
                    }}>
                        {engines.map((eng, i) => {
                            // Staggered entry
                            const entryDelay = i * 5;
                            const entry = spring({ frame: frame - entryDelay, fps, config: { damping: 12 } });

                            // Internal Data Reveal
                            const textOpacity = interpolate(expandProgress, [0.7, 1], [0, 1]);

                            return (
                                <div key={eng.name} style={{
                                    opacity: entry,
                                    transform: `scale(${entry}) translateY(${interpolate(entry, [0, 1], [50, 0])}px)`,
                                    width: containerWidth,
                                    height: containerHeight,
                                    position: 'relative'
                                }}>
                                    <GlassRefraction
                                        intensity={0.4}
                                        glowColor={eng.color}
                                        borderRadius={30}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start', // Anchored left when expanded
                                            padding: '0 30px',
                                            height: '100%',
                                            gap: 20
                                        }}>

                                            {/* PILL (Always visible) */}
                                            <div style={{ flexShrink: 0 }}>
                                                <AnimatedEnginePill engine={eng.name as any} active={true} />
                                            </div>

                                            {/* DATA CONTENT (Reveals on expand) */}
                                            <div style={{
                                                opacity: textOpacity,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flex: 1,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                fontFamily: theme.typography.fontUi
                                            }}>
                                                {/* Content Logic per engine */}
                                                {eng.name === 'Protect' && (
                                                    <>
                                                        <span style={{ fontSize: 20, color: 'white' }}>{protectData.title}</span>
                                                        <span style={{ fontSize: 20, fontWeight: 'bold', color: theme.accent.red }}>{protectData.amount}</span>
                                                    </>
                                                )}
                                                {eng.name === 'Grow' && (
                                                    <>
                                                        <span style={{ fontSize: 20, color: 'white' }}>{growData.name}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                                                <div style={{ width: `${growData.progress}%`, height: '100%', background: theme.accent.violet, borderRadius: 3 }} />
                                                            </div>
                                                            <span style={{ color: theme.accent.violet }}>{growData.progress}%</span>
                                                        </div>
                                                    </>
                                                )}
                                                {eng.name === 'Execute' && (
                                                    <>
                                                        <span style={{ fontSize: 20, color: 'white' }}>{executeData.action}</span>
                                                        <span style={{ fontSize: 13, padding: '4px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.2)', color: '#ffaaa5' }}>{executeData.priority}</span>
                                                    </>
                                                )}
                                                {eng.name === 'Govern' && (
                                                    <>
                                                        <span style={{ fontSize: 20, color: 'white' }}>{governData.description}</span>
                                                        <span style={{ fontSize: 13, padding: '4px 8px', borderRadius: 4, background: 'rgba(59,130,246,0.2)', color: '#90b4ff' }}>Verified</span>
                                                    </>
                                                )}

                                            </div>

                                        </div>
                                    </GlassRefraction>
                                </div>
                            );
                        })}
                    </div>

                    {/* HEADLINE */}
                    <AbsoluteFill style={{ top: 100, width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <h2 style={{
                            fontFamily: theme.typography.fontHeader,
                            fontSize: 48,
                            color: 'white',
                            opacity: interpolate(expandProgress, [0.5, 1], [0, 1]),
                            textShadow: '0 0 20px rgba(0,0,0,0.5)'
                        }}>
                            Modular Intelligence
                        </h2>
                    </AbsoluteFill>

                </AbsoluteFill>
            </CameraController>
        </ShotTransition>
    );
};
