
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { ShotTransition } from '../../shared/animation/ShotTransition';
import { CameraController, CameraEasing } from '../../shared/camera/CameraController';
import { theme } from '../../shared/theme';
import { SHOTS } from '../config';
import { AnimatedEnginePill } from '../../shared/live-ui/AnimatedUI';
import { GlassRefraction } from '../../shared/cinematic/GlassRefraction';

export const Shot02Turn: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Grid Assemble Animation
    const gridExpand = spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 60 }
    });

    const gridSize = interpolate(gridExpand, [0, 1], [0, 100]);

    // Camera pulls back to reveal structure
    const cameraKeyframes = [
        { frame: 0, scale: 2.0, x: 0, y: 0 },
        { frame: 90, scale: 0.8, x: 0, y: 0, easing: CameraEasing.smooth },
    ];

    const engines = ['Protect', 'Grow', 'Execute', 'Govern'] as const;

    return (
        <ShotTransition
            durationInFrames={SHOTS.shot2.duration}
            enterType="push"
            exitType="push"
        >
            <CameraController keyframes={cameraKeyframes}>
                <AbsoluteFill style={{ background: theme.background.deepNavy }}>

                    {/* GRID BACKGROUND */}
                    <AbsoluteFill style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0.3
                    }}>
                        <div style={{
                            width: '200%',
                            height: '200%',
                            backgroundSize: `${gridSize}px ${gridSize}px`,
                            backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                            transform: 'perspective(1000px) rotateX(60deg) translateY(-200px)'
                        }} />
                    </AbsoluteFill>

                    {/* ENGINE ORBS ASSEMBLING */}
                    <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
                            {engines.map((eng, i) => {
                                const delay = i * 10 + 20;
                                const reveal = spring({ frame: frame - delay, fps, config: { damping: 15 } });

                                const x = (i % 2 === 0 ? -1 : 1) * 200 * (1 - reveal);
                                const y = (i < 2 ? -1 : 1) * 200 * (1 - reveal);

                                return (
                                    <div key={eng} style={{
                                        opacity: reveal,
                                        transform: `translate(${x}px, ${y}px)`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center'
                                    }}>
                                        <GlassRefraction intensity={0.6} borderRadius={999}>
                                            <div style={{ padding: 30 }}>
                                                <AnimatedEnginePill engine={eng} active={true} />
                                            </div>
                                        </GlassRefraction>
                                    </div>
                                )
                            })}
                        </div>
                    </AbsoluteFill>

                    {/* TEXT OVERLAY */}
                    <AbsoluteFill style={{
                        top: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%'
                    }}>
                        <h2 style={{
                            fontFamily: theme.typography.fontHeader,
                            fontSize: 48,
                            color: '#fff',
                            opacity: interpolate(frame, [60, 90], [0, 1]),
                            textShadow: '0 0 20px rgba(255,255,255,0.2)'
                        }}>
                            Architecture you can see.
                        </h2>
                    </AbsoluteFill>

                </AbsoluteFill>
            </CameraController>
        </ShotTransition>
    );
};
