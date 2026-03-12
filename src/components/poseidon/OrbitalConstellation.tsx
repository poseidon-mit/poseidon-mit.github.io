import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Particles({ count = 3000 }) {
  const ref = useRef<any>(null);
  
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 1.5 * Math.cbrt(Math.random());
        p[i*3] = r * Math.sin(phi) * Math.cos(theta); // x
        p[i*3+1] = r * Math.sin(phi) * Math.sin(theta); // y
        p[i*3+2] = r * Math.cos(phi); // z
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.05;
      ref.current.rotation.y -= delta * 0.08;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial 
          transparent 
          color="#00F0FF" 
          size={0.012} 
          sizeAttenuation={true} 
          depthWrite={false} 
          opacity={0.8} 
        />
      </Points>
    </group>
  );
}

export function OrbitalConstellation() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <Particles count={4000} />
      </Canvas>
      {/* Central Cyan Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15),transparent_60%)] blur-2xl" />
      </div>
    </div>
  );
}
