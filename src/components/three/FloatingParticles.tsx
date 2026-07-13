"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#8B5CF6" transparent opacity={0.55} />
    </points>
  );
}

export function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 opacity-50">
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.25]}>
        <Particles />
      </Canvas>
    </div>
  );
}
