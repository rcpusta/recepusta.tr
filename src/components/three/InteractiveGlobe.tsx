"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GlobeMesh() {
  const group = useRef<THREE.Group>(null);
  const dots = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 400; i++) {
      const phi = Math.acos(-1 + (2 * i) / 400);
      const theta = Math.sqrt(400 * Math.PI) * phi;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi),
          Math.sin(theta) * Math.sin(phi),
          Math.cos(phi)
        ).multiplyScalar(1.6)
      );
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.55, 48, 48]} />
        <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.15} />
      </mesh>
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color={i % 7 === 0 ? "#00E5FF" : "#8B5CF6"} />
        </mesh>
      ))}
    </group>
  );
}

export function InteractiveGlobe({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <GlobeMesh />
      </Canvas>
    </div>
  );
}
