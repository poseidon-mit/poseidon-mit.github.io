import React, { useRef } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Text, Edges, RoundedBox } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { staticFile } from 'remotion';

const FONT_INTER = staticFile("/fonts/Inter-latin.woff2");
const FONT_SPACE = staticFile("/fonts/SpaceGrotesk-latin.woff2");
import * as THREE from 'three';

// 3D Engine Core Node
const CoreNode3D: React.FC<{ color: string; rotation: number; distance: number; scale: number; label: string }> = ({ color, rotation, distance, scale, label }) => {
    const x = Math.cos(rotation) * distance;
    const y = Math.sin(rotation) * distance;

    return (
        <group position={[x, y, 0]} scale={[scale, scale, scale]}>
            <Icosahedron args={[0.5, 1]} >
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1}
                    roughness={0.1}
                    metalness={0.1}
                    wireframe={true}
                />
            </Icosahedron>
            {/* Inner glowing sphere */}
            <mesh>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>

            {/* --- WWDC-TIER HTML UI COMPOSITION --- */}
            <Html center position={[0, -1.2, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{
                    color: '#fff', fontSize: '60px', fontWeight: 700,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                    letterSpacing: '8px',
                    textShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
                    background: 'rgba(0,0,0,0.5)', padding: '10px 40px', borderRadius: '100px',
                    border: `1px solid rgba(255,255,255,0.1)`, backdropFilter: 'blur(20px)'
                }}>
                    {label}
                </div>
            </Html>
        </group>
    );
};

export const Act4Convergence3D: React.FC<{ startFrame: number; durationInFrames: number }> = ({ startFrame, durationInFrames }) => {
    const globalFrame = useCurrentFrame();
    const frame = globalFrame - startFrame;
    const { fps } = useVideoConfig();
    const groupRef = useRef<THREE.Group>(null);

    // Timing: 23.0s - 30.0s (690 - 900f) => Duration: 210 frames
    // Orbit: 0 - 120f
    // Collapse & Logo: 120 - 210f

    // 1. Constellation Orbit Entrance
    const entrance = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 60, mass: 2 } });
    const orbitDistance = interpolate(entrance, [0, 1], [0, 4]);
    const nodeScale = interpolate(entrance, [0, 1], [0.1, 1]);

    const baseRotation = (frame * 0.01);

    // 2. The Collapse
    const collapse = spring({ frame: frame - 105, fps, config: { damping: 20, stiffness: 100 } });
    const finalDistance = interpolate(collapse, [0, 1], [orbitDistance, 0]);
    const nodeOpacity = interpolate(collapse, [0, 1], [1, 0]);

    // 3. Logo Reveal (Optical flare transition)
    const logoReveal = spring({ frame: frame - 125, fps, config: { damping: 15, stiffness: 80 } });
    const logoScale = interpolate(logoReveal, [0, 1], [0.8, 1]);
    const bloomBurst = interpolate(frame, [110, 125, 150], [1, 6, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // 4. Final Fade Out
    const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    useFrame((state) => {
        if (!groupRef.current) return;
        // The whole constellation slowly orbits in 3D space
        groupRef.current.rotation.x = Math.sin(frame * 0.01) * 0.2;
        groupRef.current.rotation.y = Math.cos(frame * 0.01) * 0.2;

        // Camera pulls back slightly
        const camZ = interpolate(frame, [0, 210], [10, 12]);
        state.camera.position.set(0, 0, camZ);
        state.camera.lookAt(0, 0, 0);
    });

    if (frame < 0 || frame >= durationInFrames) return null;

    return (
        <group>
            <ambientLight intensity={4} />
            <directionalLight position={[0, 10, 10]} intensity={10} color="#ffffff" />
            <directionalLight position={[10, 0, 10]} intensity={5} color="#00F0FF" />
            <EffectComposer>
                <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={bloomBurst} />
            </EffectComposer>

            <group ref={groupRef}>
                {nodeOpacity > 0.01 && (
                    <>
                        <CoreNode3D color="#00F0FF" rotation={baseRotation + 0} distance={finalDistance} scale={nodeScale * nodeOpacity} label="DASHBOARD" />
                        <CoreNode3D color="#22C55E" rotation={baseRotation + (Math.PI * 2 / 5) * 1} distance={finalDistance} scale={nodeScale * nodeOpacity} label="PROTECT" />
                        <CoreNode3D color="#8B5CF6" rotation={baseRotation + (Math.PI * 2 / 5) * 2} distance={finalDistance} scale={nodeScale * nodeOpacity} label="GROW" />
                        <CoreNode3D color="#EAB308" rotation={baseRotation + (Math.PI * 2 / 5) * 3} distance={finalDistance} scale={nodeScale * nodeOpacity} label="EXECUTE" />
                        <CoreNode3D color="#3B82F6" rotation={baseRotation + (Math.PI * 2 / 5) * 4} distance={finalDistance} scale={nodeScale * nodeOpacity} label="GOVERN" />
                    </>
                )}
            </group>

            {/* The Final POSEIDON.AI Logo -> True Native WebGL Text for crystal clear font-rendering */}
            {
                logoReveal > 0 && (
                    <group scale={[logoScale, logoScale, logoScale]} position={[0, 0, 2]}>
                        <group position={[0, 0, 0]} scale={2.5}>
                            <Text position={[0, 0, 0]} fontSize={1.6} font={FONT_SPACE} fontWeight={800} color="#ffffff" anchorX="center" anchorY="middle" letterSpacing={0.2} fillOpacity={fadeOut}>
                                POSEIDON.AI
                            </Text>
                            <Text position={[0, -1.0, 0]} fontSize={0.3} font={FONT_INTER} fontWeight={500} color="#888888" anchorX="center" anchorY="middle" letterSpacing={0.4} fillOpacity={fadeOut}>
                                MIT SLOAN CAPSTONE 2026
                            </Text>
                        </group>
                    </group>
                )
            }

        </group >
    );
};
