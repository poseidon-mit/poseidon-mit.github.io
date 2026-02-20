import React, { useRef } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { useFrame } from '@react-three/fiber';
import { Environment, Text, RoundedBox, Edges } from '@react-three/drei';
import { staticFile } from 'remotion';

const FONT_INTER = staticFile("/fonts/Inter-latin.woff2");
const FONT_SPACE = staticFile("/fonts/SpaceGrotesk-latin.woff2");
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// A single 3D floating Glass Panel
const GlassRow3D: React.FC<{ position: [number, number, number]; isFocus?: boolean; opacity?: number }> = ({ position, isFocus, opacity = 1 }) => {
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[8, 1.5, 0.05]} />
                <meshPhysicalMaterial
                    color={isFocus ? "#22c55e" : "#ffffff"}
                    transmission={isFocus ? 0.3 : 0.8}
                    opacity={opacity}
                    transparent
                    roughness={0.1}
                    metalness={0.5}
                    clearcoat={1}
                />
            </mesh>
            {/* --- TRUE WWDC-TIER WEBGL NATIVE UI --- */}
            <group position={[0, 0, 0.03]}>
                <Text position={[-3.5, 0.4, 0]} fontSize={0.18} font={FONT_INTER} fontWeight={700} color={isFocus ? '#22c55e' : '#888888'} anchorX="left" anchorY="middle" letterSpacing={0.1} fillOpacity={opacity}>
                    {isFocus ? 'CRITICAL THREAT ISOLATED' : 'THREAT ID: 8847'}
                </Text>

                <Text position={[-3.5, -0.05, 0]} fontSize={0.4} font={FONT_SPACE} fontWeight={700} color="#ffffff" anchorX="left" anchorY="middle" letterSpacing={-0.01} fillOpacity={opacity}>
                    {isFocus ? 'Lateral Movement Blocked' : 'Suspicious Wire Transfer'}
                </Text>

                <Text position={[-3.5, -0.5, 0]} fontSize={0.15} font={FONT_INTER} fontWeight={400} color="#a0a0a0" anchorX="left" anchorY="middle" letterSpacing={0.05} fillOpacity={opacity}>
                    Confidence: 99.8%  •  NODE: EU-WEST-3
                </Text>

                {isFocus && (
                    <group position={[2.5, 0, 0]}>
                        <RoundedBox args={[2.5, 0.8, 0.02]} radius={0.4}>
                            <meshBasicMaterial color="#22c55e" opacity={0.15} transparent />
                            <Edges linewidth={2} color="#22c55e" opacity={0.6} transparent />
                        </RoundedBox>
                        <Text position={[0, 0, 0.02]} fontSize={0.22} font={FONT_SPACE} fontWeight={800} color="#22c55e" anchorX="center" anchorY="middle" letterSpacing={0.1} fillOpacity={opacity}>
                            NEUTRALIZED
                        </Text>
                    </group>
                )}
            </group>
        </group>
    );
};

export const Act2DeepResolution3D: React.FC<{ startFrame: number; durationInFrames: number }> = ({ startFrame, durationInFrames }) => {
    const globalFrame = useCurrentFrame();
    const frame = globalFrame - startFrame;
    const { fps } = useVideoConfig();
    const targetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

    // Timing: 7.0s - 14.5s (210 - 435f) => Duration: 225 frames

    // 1. Z-Space Fly-Through Animation
    const flyProgress = spring({ frame: frame - 15, fps, config: { damping: 200, mass: 2 } });

    // 2. The Pop Forward
    const popProgress = spring({ frame: frame - 60, fps, config: { damping: 12, stiffness: 120 } });
    const topZ = interpolate(popProgress, [0, 1], [-2, 1]);

    // 3. Cinematic Depth of Field focus (shifting focus from back planes to front plane)
    const dofProgress = spring({ frame: frame - 105, fps, config: { damping: 20, stiffness: 80 } });
    const focusDistance = interpolate(dofProgress, [0, 1], [0.1, 0.02]);

    // 4. Micro-Interaction (Button Press & Ripple - mapped to bloom intensity)
    const pressProgress = spring({ frame: frame - 150, fps, config: { damping: 12, stiffness: 300 } });
    const releaseProgress = spring({ frame: frame - 156, fps, config: { damping: 12, stiffness: 200 } });
    const bloomIntensity = interpolate(releaseProgress, [0, 1], [0.5, 3]);

    useFrame((state) => {
        // Camera flies slowly through the Z space
        const camZ = interpolate(flyProgress, [0, 1], [10, 6]);
        const camX = interpolate(flyProgress, [0, 1], [2, 0]);
        state.camera.position.set(camX, 0, camZ);

        // Pan lookAt to center the popping element
        targetRef.current.set(
            interpolate(dofProgress, [0, 1], [1, 0]),
            0,
            interpolate(dofProgress, [0, 1], [-2, 1])
        );
        state.camera.lookAt(targetRef.current);
    });

    if (frame < 0 || frame >= durationInFrames) return null;

    return (
        <group>
            {/* Physical Lights instead of Async Environment */}
            <ambientLight intensity={4} />
            <spotLight position={[0, 10, 10]} intensity={50} color="#22c55e" penumbra={1} />
            <directionalLight position={[-5, 5, -5]} intensity={10} color="#ffffff" />

            {/* PostProcessing: True Optical DOF and Bloom */}
            <EffectComposer>
                <DepthOfField focusDistance={focusDistance} focalLength={0.05} bokehScale={10} height={480} />
                <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={bloomIntensity} />
            </EffectComposer>

            {/* Background Data Layers */}
            <GlassRow3D position={[0, 2, -6]} opacity={1 - (dofProgress * 0.8)} />
            <GlassRow3D position={[0, 0, -4]} opacity={1 - (dofProgress * 0.5)} />

            {/* The Foreground Critical Threat */}
            <GlassRow3D position={[0, -2, topZ]} isFocus />

        </group >
    );
};
