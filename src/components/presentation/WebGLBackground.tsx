import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function Scene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;

        // Parallax logic based on scroll
        const scrollY = window.scrollY;
        // Slow down the shift relative to scroll
        const targetY = scrollY * 0.005;
        const targetRotX = scrollY * 0.001;
        const targetRotY = scrollY * 0.0005;

        // Smooth interpolation with lerp
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    });

    // Physically Based Material for Premium Frosted Glass
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.95, // Glass-like transparency
        ior: 1.5, // Index of refraction
        thickness: 2.0,
        transparent: true,
    });

    // Neon Accent Material
    const accentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.6,
    });

    const secondaryAccentMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x7b39fc,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x7b39fc,
        emissiveIntensity: 0.6,
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
                <Icosahedron args={[1.5, 0]} position={[-3, 1, -2]}>
                    <primitive object={glassMaterial} attach="material" />
                </Icosahedron>
            </Float>

            <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
                <Torus args={[2, 0.4, 32, 100]} position={[2, -1, -3]}>
                    <primitive object={glassMaterial} attach="material" />
                </Torus>
            </Float>

            <Float speed={2.5} rotationIntensity={1} floatIntensity={3}>
                <Sphere args={[0.6, 64, 64]} position={[4, 3, -4]}>
                    <primitive object={accentMaterial} attach="material" />
                </Sphere>
            </Float>

            <Float speed={1.2} rotationIntensity={2} floatIntensity={1.5}>
                <Icosahedron args={[0.5, 0]} position={[-4, -3, -1]}>
                    <primitive object={secondaryAccentMaterial} attach="material" />
                </Icosahedron>
            </Float>

            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Sphere args={[1.2, 64, 64]} position={[0, -4, -5]}>
                    <primitive object={glassMaterial} attach="material" />
                </Sphere>
            </Float>
        </group>
    );
}

export function WebGLBackground() {
    return (
        <div className="fixed inset-0 z-0 bg-[#05050A] pointer-events-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                {/* Cinematic 3-point lighting */}
                <ambientLight intensity={0.2} />

                {/* Key light */}
                <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />

                {/* Fill light */}
                <pointLight position={[-5, 5, -5]} intensity={2} color="#00f0ff" />

                {/* Rim light component to create neon rim wrap */}
                <pointLight position={[0, -5, 2]} intensity={3} color="#7b39fc" distance={20} />

                {/* Environment map for realistic reflections on glass */}
                <Environment preset="city" />

                <Scene />
            </Canvas>
        </div>
    );
}
