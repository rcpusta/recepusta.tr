"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import * as THREE from "three";

function NetworkPoints({ light }: { light: boolean }) {
  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);

  const { positions, linePositions } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const connections: number[] = [];
    const coords: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 2.2;
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(phi);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      coords.push(new THREE.Vector3(x, y, z));
    }

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (coords[i].distanceTo(coords[j]) < 0.95) {
          connections.push(
            coords[i].x,
            coords[i].y,
            coords[i].z,
            coords[j].x,
            coords[j].y,
            coords[j].z
          );
        }
      }
    }

    return { positions: pos, linePositions: new Float32Array(connections) };
  }, []);

  useFrame(({ clock }) => {
    if (points.current) points.current.rotation.y = clock.getElapsedTime() * 0.08;
    if (lines.current) lines.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return (
    <group>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={light ? 0.05 : 0.04}
          color={light ? "#3d5a80" : "#00E5FF"}
          transparent
          opacity={light ? 0.9 : 0.9}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={light ? "#3b6ea8" : "#3B82F6"}
          transparent
          opacity={light ? 0.4 : 0.28}
        />
      </lineSegments>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Sphere args={[1.55, 48, 48]}>
          <meshStandardMaterial
            color={light ? "#3b6ea8" : "#3B82F6"}
            wireframe
            transparent
            opacity={light ? 0.2 : 0.12}
            emissive={light ? "#5b6bc7" : "#8B5CF6"}
            emissiveIntensity={light ? 0.25 : 0.2}
          />
        </Sphere>
      </Float>
    </group>
  );
}

export function NetworkSphere() {
  const { theme } = useTheme();
  const light = theme === "light";

  return (
    <div className={`network-sphere absolute inset-0 -z-0 ${light ? "opacity-95" : "opacity-80"}`}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={light ? 0.65 : 0.4} />
        <pointLight position={[4, 4, 4]} intensity={light ? 1.2 : 1.2} color={light ? "#3b6ea8" : "#00E5FF"} />
        <pointLight position={[-4, -2, -2]} intensity={light ? 0.85 : 0.8} color={light ? "#5b6bc7" : "#8B5CF6"} />
        <NetworkPoints light={light} />
      </Canvas>
    </div>
  );
}
