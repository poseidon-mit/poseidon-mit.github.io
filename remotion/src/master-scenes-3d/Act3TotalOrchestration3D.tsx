import React, { useRef, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { useFrame } from '@react-three/fiber';
import { Line, RoundedBox, Environment, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { staticFile } from 'remotion';

const FONT_INTER = staticFile("/fonts/Inter-latin.woff2");
const FONT_SPACE = staticFile("/fonts/SpaceGrotesk-latin.woff2");

export const Act3TotalOrchestration3D: React.FC<{ startFrame: number; durationInFrames: number }> = ({ startFrame, durationInFrames }) => {
    const globalFrame = useCurrentFrame();
    const frame = globalFrame - startFrame;
    const { fps } = useVideoConfig();
    const cameraRef = useRef<THREE.Group>(null);

    // Timing: 14.5s - 23.0s (435 - 690f) => Duration: 255 frames
    // Grow Synthesis: 0 - 120f
    // Govern Audit Stream: 120 - 255f

    // 1. Chart Drawing Animation
    const drawProgress = spring({ frame: frame - 15, fps, config: { damping: 20, stiffness: 60 } });
    const projectedReturn = Math.max(0, interpolate(drawProgress, [0, 1], [0, 18.4])).toFixed(1);

    // Generate 3D curve for the chart
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= 100; i++) {
            const x = (i / 100) * 10 - 5;
            // Exponential curve mapping
            const y = Math.pow(i / 100, 2) * 4 - 2;
            pts.push(new THREE.Vector3(x, y, 0));
        }
        return pts;
    }, []);

    // 2. Camera Move (Tilt Up to Govern Section)
    const tiltProgress = spring({ frame: frame - 120, fps, config: { damping: 15, stiffness: 60 } });

    // 3. Govern Audit Stream (HTML Overlay on continuous 3D plane)
    const governZ = interpolate(tiltProgress, [0, 1], [-10, -4]);

    useFrame((state) => {
        // As tiltProgress goes 0 -> 1, camera flies "down" to look at the next section "below"
        const camY = interpolate(tiltProgress, [0, 1], [0, -8]);
        const lookY = interpolate(tiltProgress, [0, 1], [0, -8]);
        state.camera.position.set(0, camY, 6);
        state.camera.lookAt(0, lookY, 0);
    });

    if (frame < 0 || frame >= durationInFrames) return null;

    return (
        <group>
            <ambientLight intensity={4} />
            <directionalLight position={[0, 10, 10]} intensity={10} color="#8B5CF6" />
            <directionalLight position={[10, 0, 10]} intensity={5} color="#3B82F6" />

            <EffectComposer>
                <Bloom luminanceThreshold={0.5} intensity={1.5} />
            </EffectComposer>

            {/* --- TOP SECTION: GROW (3D Glowing Curve) --- */}
            <group position={[0, 0, 0]}>
                <ambientLight intensity={1} color="#8B5CF6" />

                {/* Connecting glowing grid */}
                <gridHelper args={[20, 20, '#8B5CF6', 'rgba(139, 92, 246, 0.1)']} position={[0, -2.5, 0]} rotation={[Math.PI / 2, 0, 0]} />

                {/* The Extruded 3D Chart Line */}
                {drawProgress > 0 && (
                    <Line
                        points={points.slice(0, Math.ceil(drawProgress * points.length))}
                        color="#8B5CF6"
                        lineWidth={4}
                        dashed={false}
                    />
                )}

                {/* --- TRUE WWDC-TIER WEBGL NATIVE UI --- */}
                {drawProgress > 0 && (
                    <group position={[points[Math.min(points.length - 1, Math.max(0, Math.ceil(drawProgress * points.length) - 1))].x + 0.5, points[Math.min(points.length - 1, Math.max(0, Math.ceil(drawProgress * points.length) - 1))].y - 0.5, 0]}>
                        <RoundedBox args={[3.2, 1.6, 0.02]} radius={0.15}>
                            <meshPhysicalMaterial color="#0a0a0f" transmission={0.4} opacity={0.8} transparent roughness={0.1} />
                            <Edges linewidth={1} color="#8B5CF6" opacity={0.4} transparent />
                        </RoundedBox>

                        <Text position={[-1.4, 0.4, 0.02]} fontSize={0.15} font={FONT_INTER} fontWeight={600} color="#a78bfa" anchorX="left" anchorY="middle" letterSpacing={0.1}>
                            PROJECTED RETURN
                        </Text>
                        <Text position={[-1.4, -0.1, 0.02]} fontSize={0.6} font={FONT_SPACE} fontWeight={800} color="#ffffff" anchorX="left" anchorY="middle" letterSpacing={-0.02}>
                            +{projectedReturn}%
                        </Text>
                        <Text position={[-1.4, -0.5, 0.02]} fontSize={0.12} font={FONT_INTER} color="#888888" anchorX="left" anchorY="middle" letterSpacing={0.05}>
                            Probability: 94.2%  •  Horizons: 14D
                        </Text>
                    </group>
                )}
            </group>

            {/* --- BOTTOM SECTION: GOVERN (Audit Stream) --- */}
            <group position={[0, -8, 0]}>

                {/* Imposing Glass Monolith representing the database/log */}
                <RoundedBox args={[8, 5, 0.2]} radius={0.1} smoothness={4} position={[0, 0, governZ - 0.2]}>
                    <meshPhysicalMaterial color="#3B82F6" transmission={0.5} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
                </RoundedBox>

                <Html transform position={[0, 0, governZ]} scale={0.005} style={{ width: 1600, height: 1000, overflow: 'hidden' }}>
                    <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'monospace', color: '#fff', opacity: tiltProgress }}>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} style={{
                                padding: '24px 48px', borderBottom: '2px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.05)',
                                display: 'flex', gap: 32, alignItems: 'center', fontSize: 28,
                                transform: `translateY(${interpolate(spring({ frame: frame - 120 - (i * 2), fps, config: { damping: 15 } }), [0, 1], [40, 0])}px)`,
                                opacity: spring({ frame: frame - 120 - (i * 2), fps, config: { damping: 15 } })
                            }}>
                                <span style={{ color: '#00F0FF' }}>[SYS_{8900 + i}]</span>
                                <span>Autonomous Event Executed.</span>
                                <span style={{ marginLeft: 'auto', color: '#3B82F6', fontWeight: 'bold' }}>VERIFIED</span>
                            </div>
                        ))}
                    </div>
                </Html>
            </group>

        </group>
    );
};
