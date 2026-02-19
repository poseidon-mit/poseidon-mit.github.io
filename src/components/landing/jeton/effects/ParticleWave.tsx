import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface ParticleWaveProps {
  onReady?: () => void;
  quality?: 'auto' | 'balanced' | 'high';
  pointerIntensity?: number;
  className?: string;
}

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uPointerIntensity;
varying float vHeight;

void main() {
  vec3 pos = position;

  float wavePrimary = sin(pos.x * 0.85 + uTime * 0.55) * cos(pos.z * 0.65 + uTime * 0.38);
  float waveSecondary = sin(pos.x * 1.4 + uTime * 0.22) * 0.35;

  float dist = distance(pos.xz, uMouse * 5.8);
  float ripple = exp(-dist * dist * 1.8) * sin(dist * 4.5 - uTime * 2.8) * uPointerIntensity;

  float height = wavePrimary * 0.42 + waveSecondary + ripple;
  pos.y += height;
  vHeight = height;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float depthScale = clamp(2.4 / -mvPosition.z, 0.72, 2.2);
  gl_PointSize = (2.0 + height * 0.8) * depthScale;
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uCyanColor;
varying float vHeight;

void main() {
  vec2 pointCenter = gl_PointCoord - 0.5;
  float radius = length(pointCenter);
  if (radius > 0.5) {
    discard;
  }

  float t = smoothstep(-0.42, 0.56, vHeight);
  vec3 color = mix(uBaseColor, uCyanColor, t * 0.78);
  float alpha = smoothstep(0.52, 0.18, radius) * mix(0.30, 1.0, t);

  gl_FragColor = vec4(color, alpha);
}
`;

function resolveGrid(quality: ParticleWaveProps['quality']): [number, number] {
  if (quality === 'high') return [180, 110];
  if (quality === 'balanced') return [150, 100];
  if (typeof window !== 'undefined' && window.innerWidth > 1440) {
    return [170, 105];
  }
  return [140, 90];
}

interface ParticleFieldProps {
  onReady?: () => void;
  quality: NonNullable<ParticleWaveProps['quality']>;
  pointerIntensity: number;
}

function ParticleField({ onReady, quality, pointerIntensity }: ParticleFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const readyRef = useRef(false);
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const mouseCurrent = useRef(new THREE.Vector2(0, 0));

  const [xCount, zCount] = useMemo(() => resolveGrid(quality), [quality]);

  const positions = useMemo(() => {
    const total = xCount * zCount;
    const buffer = new Float32Array(total * 3);

    let index = 0;
    for (let zi = 0; zi < zCount; zi += 1) {
      for (let xi = 0; xi < xCount; xi += 1) {
        const x = (xi / (xCount - 1) - 0.5) * 16;
        const z = (zi / (zCount - 1) - 0.5) * 10;
        buffer[index] = x;
        buffer[index + 1] = 0;
        buffer[index + 2] = z;
        index += 3;
      }
    }

    return buffer;
  }, [xCount, zCount]);

  const geometry = useMemo(() => {
    const object = new THREE.BufferGeometry();
    object.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return object;
  }, [positions]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPointerIntensity: { value: pointerIntensity },
      uBaseColor: { value: new THREE.Color('#0A1628') },
      uCyanColor: { value: new THREE.Color('#00F0FF') },
    }),
    [pointerIntensity],
  );

  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry],
  );

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

    mouseCurrent.current.lerp(mouseTarget.current, Math.min(1, delta * 4.2));
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

export default function ParticleWave({
  onReady,
  quality = 'auto',
  pointerIntensity = 0.32,
  className,
}: ParticleWaveProps) {
  return (
    <Canvas
      className={cn('absolute inset-0 h-full w-full', className)}
      camera={{ position: [0, 3.6, 7], fov: 48 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ParticleField onReady={onReady} quality={quality} pointerIntensity={pointerIntensity} />
    </Canvas>
  );
}
