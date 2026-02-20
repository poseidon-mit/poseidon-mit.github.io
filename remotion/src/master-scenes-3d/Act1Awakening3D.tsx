import React, { useRef } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox, Text, Edges, Environment, ContactShadows } from '@react-three/drei';
import { staticFile } from 'remotion';

const FONT_INTER = staticFile("/fonts/Inter-latin.woff2");
const FONT_SPACE = staticFile("/fonts/SpaceGrotesk-latin.woff2");
import * as THREE from 'three';

// A simple WebGL representation of the MacBook Screen
export const Act1Awakening3D: React.FC<{ startFrame: number; durationInFrames: number }> = ({ startFrame, durationInFrames }) => {
    const globalFrame = useCurrentFrame();
    const frame = globalFrame - startFrame;
    const { fps } = useVideoConfig();
    const groupRef = useRef<THREE.Group>(null);
    const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

    // Timing: 0 to 7 seconds = 210 frames
    // The Arrival: 0 - 60f
    // Cascading Load: 60 - 135f
    // The Macro Dive: 135 - 210f

    // -- 1. The Physical Arrival --
    // We use a critically-damped spring for heavy inertia
    const arriveSpring = spring({ frame, fps, config: { damping: 14, stiffness: 60, mass: 3 } });

    // Animate MacBook coming from dark distance
    const macZ = interpolate(arriveSpring, [0, 1], [-20, 0]);
    const macRotX = interpolate(arriveSpring, [0, 1], [-Math.PI / 4, 0]); // Pitch backward to flat

    // -- 2. Cascading Load (HTML Overlay on the 3D plane) --
    // We synchronize HTML DOM elements to appear after the 3D model settles
    const contentOpacity = spring({ frame: frame - 60, fps, config: { damping: 200 } });

    // -- 3. The Optic Camera Dive --
    // Exponential dive acting directly on the Three.js camera
    const diveProgress = Math.pow(Math.max(0, interpolate(frame, [135, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })), 4);

    // -- 4. Micro-Interaction Spring (Number Impact) --
    const impactSpring = spring({ frame: frame - 180, fps, config: { damping: 12, stiffness: 200 } });
    const threatCount = Math.floor(interpolate(impactSpring, [0, 1], [0, 23]));

    useFrame((state) => {
        if (!groupRef.current) return;

        // Apply MacBook physical transformations
        groupRef.current.position.z = macZ;
        groupRef.current.rotation.x = macRotX;

        // Apply Camera Dive
        // Start position [0, 0, 10], Dive position [2.5, 1, 0.4] (intimately close to the glass)
        const targetZ = interpolate(diveProgress, [0, 1], [10, 0.6]);
        const targetX = interpolate(diveProgress, [0, 1], [0, 2.2]); // Panning to the target card
        const targetY = interpolate(diveProgress, [0, 1], [0, 1.2]);

        state.camera.position.set(targetX, targetY, targetZ);

        // Ensure camera keeps looking slightly inward to simulate target tracking constraints
        cameraTarget.current.set(
            interpolate(diveProgress, [0, 1], [0, 2.3]),
            interpolate(diveProgress, [0, 1], [0, 1.2]),
            0
        );
        state.camera.lookAt(cameraTarget.current);
    });

    if (frame < 0 || frame >= durationInFrames) return null;

    return (
        <group>
            {/* Cinematic Lighting (Realtime Physical instead of Async Environment) */}
            <ambientLight intensity={4} />
            <directionalLight position={[10, 10, 10]} intensity={10} color="#ffffff" />
            <directionalLight position={[-10, 5, -10]} intensity={5} color="#00F0FF" />
            <spotLight position={[0, 10, 10]} intensity={50} angle={0.5} penumbra={1} color="#00F0FF" />

            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.4} far={10} color="#000000" position={[0, -2, 0]} />

            <group ref={groupRef}>
                {/* MacBook Aluminum Chassis */}
                <RoundedBox args={[7, 4.5, 0.1]} radius={0.1} smoothness={4} position={[0, 0, -0.06]}>
                    <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
                </RoundedBox>

                {/* MacBook Glass Screen */}
                <Box args={[6.8, 4.3, 0.05]} position={[0, 0, 0]}>
                    <meshPhysicalMaterial
                        color="#050508"
                        transmission={0.2}
                        roughness={0.1}
                        metalness={0.9}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </Box>

                {/* --- 100% NATIVE WEBGL UI LAYER --- */}
                {/* 
                   Replacing `<Html>` with `<Text>` and `<RoundedBox>` to completely bypass 
                   Remotion headless CSS3D scaling bugs.
                */}
                <group position={[0, 0, 0.05]}>

                    {/* --- TRUE WWDC-TIER WEBGL NATIVE UI --- */}
                    {/* Header */}
                    <Text position={[-3.1, 1.8, 0.02]} fontSize={0.16} font={FONT_SPACE} fontWeight={800} color="#ffffff" anchorX="left" anchorY="middle" letterSpacing={0.1} fillOpacity={contentOpacity}>
                        POSEIDON.AI
                    </Text>
                    <Text position={[2.7, 1.8, 0.02]} fontSize={0.14} font={FONT_INTER} fontWeight={500} color="#888888" anchorX="right" anchorY="middle" letterSpacing={0.2} fillOpacity={contentOpacity}>
                        EXECUTIVE DASHBOARD
                    </Text>

                    {/* Main Chart Card (Net Worth) */}
                    <group position={[-1.3, 0.2, 0.02]}>
                        <RoundedBox args={[3.8, 2.6, 0.02]} radius={0.1}>
                            <meshPhysicalMaterial color="#050508" transmission={0.6} opacity={contentOpacity * 0.9} transparent roughness={0.2} ior={1.5} thickness={0.5} />
                            <Edges linewidth={1} color="#ffffff" opacity={contentOpacity * 0.15} transparent />
                        </RoundedBox>

                        <Text position={[-1.7, 1.0, 0.02]} fontSize={0.14} font={FONT_INTER} color="#a0a0a0" anchorX="left" anchorY="middle" letterSpacing={0.1} fillOpacity={contentOpacity}>
                            NET WORTH PREDICTION
                        </Text>

                        <Text position={[-1.7, 0.3, 0.02]} fontSize={0.6} font={FONT_SPACE} fontWeight={700} color="#ffffff" anchorX="left" anchorY="middle" letterSpacing={-0.02} fillOpacity={contentOpacity}>
                            $142.8
                        </Text>
                        <Text position={[0.2, 0.3, 0.02]} fontSize={0.3} font={FONT_SPACE} fontWeight={500} color="#888888" anchorX="left" anchorY="middle" fillOpacity={contentOpacity}>
                            M
                        </Text>

                        <Text position={[-1.7, -0.4, 0.02]} fontSize={0.16} font={FONT_INTER} fontWeight={600} color="#00F0FF" anchorX="left" anchorY="middle" fillOpacity={contentOpacity}>
                            +24.5% projected
                        </Text>
                    </group>

                    {/* System Load Card */}
                    <group position={[1.7, 0.9, 0.02]}>
                        <RoundedBox args={[1.8, 1.2, 0.02]} radius={0.1}>
                            <meshPhysicalMaterial color="#050508" transmission={0.6} opacity={contentOpacity * 0.9} transparent roughness={0.2} ior={1.5} thickness={0.5} />
                            <Edges linewidth={1} color="#ffffff" opacity={contentOpacity * 0.15} transparent />
                        </RoundedBox>

                        <Text position={[-0.7, 0.35, 0.02]} fontSize={0.12} font={FONT_INTER} color="#a0a0a0" anchorX="left" anchorY="middle" letterSpacing={0.1} fillOpacity={contentOpacity}>
                            SYSTEM LOAD
                        </Text>
                        <Text position={[0, -0.15, 0.02]} fontSize={0.45} font={FONT_SPACE} fontWeight={300} color="#ffffff" anchorX="center" anchorY="middle" fillOpacity={contentOpacity}>
                            12%
                        </Text>
                    </group>

                    {/* Active Threats Card */}
                    <group position={[1.7, -0.5, 0.02]}>
                        <RoundedBox args={[1.8, 1.2, 0.02]} radius={0.1}>
                            <meshPhysicalMaterial
                                color={impactSpring > 0 ? "#ff2222" : "#050508"}
                                transmission={0.6}
                                opacity={Math.max(contentOpacity * 0.9, impactSpring * 0.6)}
                                transparent
                                roughness={0.2}
                                ior={1.5} thickness={0.5}
                            />
                            <Edges linewidth={1} color={impactSpring > 0 ? "#ff4444" : "#ffffff"} opacity={Math.max(contentOpacity * 0.15, impactSpring * 0.8)} transparent />
                        </RoundedBox>

                        <Text position={[-0.7, 0.35, 0.02]} fontSize={0.12} font={FONT_INTER} color={impactSpring > 0 ? "#ff8888" : "#a0a0a0"} anchorX="left" anchorY="middle" letterSpacing={0.1} fillOpacity={contentOpacity}>
                            ACTIVE THREATS
                        </Text>
                        <Text
                            position={[0, -0.15, 0.02]}
                            fontSize={0.6}
                            font={FONT_SPACE}
                            fontWeight={800}
                            color={impactSpring > 0 ? "#ff3b30" : "#00F0FF"}
                            anchorX="center" anchorY="middle"
                            fillOpacity={contentOpacity}
                        >
                            {threatCount}
                        </Text>
                    </group>
                </group>
            </group>
        </group>
    );
};
