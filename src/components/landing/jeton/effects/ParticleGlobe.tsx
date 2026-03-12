// @ts-nocheck
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface ParticleGlobeProps {
  onReady?: () => void;
  quality?: 'auto' | 'balanced' | 'high';
  className?: string;
}

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
varying float vHeight;

void main() {
  vec3 pos = position;

  // Slow rotation around Y axis
  float angle = uTime * 0.15;
  float cosA = cos(angle);
  float sinA = sin(angle);
  vec3 rotated = vec3(
    pos.x * cosA - pos.z * sinA,
    pos.y,
    pos.x * sinA + pos.z * cosA
  );

  // Surface displacement — breathing effect
  float noise = sin(pos.x * 3.0 + uTime * 0.4) * cos(pos.y * 2.5 + uTime * 0.3) * 0.06;
  float radius = length(rotated);
  vec3 dir = normalize(rotated);
  rotated = dir * (radius + noise);

  // Mouse proximity ripple (NDC → approximate world)
  vec2 mouseWorld = vec2(uMouse.x * 3.0, uMouse.y * 3.0);
  float dist = distance(rotated.xy, mouseWorld);
  float ripple = exp(-dist * dist * 1.2) * sin(dist * 4.0 - uTime * 2.5) * 0.12;
  rotated += dir * ripple;

  vHeight = noise + ripple;

  vec4 mvPosition = modelViewMatrix * vec4(rotated, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float depthScale = clamp(3.5 / -mvPosition.z, 0.3, 2.5);
  gl_PointSize = (1.8 + vHeight * 4.0) * depthScale;
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uCyanColor;
varying float vHeight;

void main() {
  vec2 pointCenter = gl_PointCoord - 0.5;
  float radius = length(pointCenter);
  if (radius > 0.5) discard;

  float t = smoothstep(-0.1, 0.15, vHeight);
  vec3 color = mix(uBaseColor, uCyanColor, t * 0.85 + 0.15);
  float alpha = smoothstep(0.5, 0.15, radius) * mix(0.25, 0.9, t);

  gl_FragColor = vec4(color, alpha);
}
`;

function resolveCount(quality: ParticleGlobeProps['quality']): number {
  if (quality === 'high') return 12000;
  if (quality === 'balanced') return 8000;
  if (typeof window !== 'undefined' && window.innerWidth > 1440) return 10000;
  if (typeof window !== 'undefined' && window.innerWidth < 768) return 4000;
  return 8000;
}

function SphereField({ onReady, quality }: { onReady?: () => void; quality: NonNullable<ParticleGlobeProps['quality']> }) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const readyRef = useRef(false);
  const mouseTarget = useRef(new THREE.Vector2(-999, -999));
  const mouseCurrent = useRef(new THREE.Vector2(-999, -999));

  const count = useMemo(() => resolveCount(quality), [quality]);

  const positions = useMemo(() => {
    const buffer = new Float32Array(count * 3);
    const radius = 2.0;

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution for even spacing
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = ((1 + Math.sqrt(5)) / 2) * i * Math.PI * 2;

      buffer[i * 3] = Math.cos(theta) * radiusAtY * radius;
      buffer[i * 3 + 1] = y * radius;
      buffer[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;
    }

    return buffer;
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(-999, -999) },
    uBaseColor: { value: new THREE.Color('#0a1628') },
    uCyanColor: { value: new THREE.Color('#00F0FF') },
  }), []);

  useEffect(() => () => { geometry.dispose(); }, [geometry]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      mouseTarget.current.set(x, -y);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    mouseCurrent.current.lerp(mouseTarget.current, Math.min(1, delta * 3));
    materialRef.current.uniforms.uMouse.value.copy(mouseCurrent.current);
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    if (!readyRef.current) {
      readyRef.current = true;
      onReady?.();
    }
  });

  return (
    <points frustumCulled={false}>
      <primitive attach="geometry" object={geometry} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleGlobe({ onReady, quality = 'auto', className }: ParticleGlobeProps) {
  return (
    <Canvas
      className={cn('absolute inset-0 h-full w-full', className)}
      camera={{ position: [0, 0.3, 5.5], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
    >
      <SphereField onReady={onReady} quality={quality} />
    </Canvas>
  );
}
