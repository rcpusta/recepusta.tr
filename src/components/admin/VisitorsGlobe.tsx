"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type GlobeCountry = {
  code: string;
  name: string;
  count: number;
  lat: number;
  lng: number;
};

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeScene({ countries }: { countries: GlobeCountry[] }) {
  const group = useRef<THREE.Group>(null);
  const maxCount = Math.max(...countries.map((c) => c.count), 1);

  const markers = useMemo(
    () =>
      countries.map((c) => ({
        ...c,
        position: latLngToVector3(c.lat, c.lng, 1.62),
        size: 0.035 + (c.count / maxCount) * 0.08,
      })),
    [countries, maxCount]
  );

  const dots = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 320; i++) {
      const phi = Math.acos(-1 + (2 * i) / 320);
      const theta = Math.sqrt(320 * Math.PI) * phi;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi),
          Math.sin(theta) * Math.sin(phi),
          Math.cos(phi)
        ).multiplyScalar(1.55)
      );
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.52, 48, 48]} />
        <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.14} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.55} />
      </mesh>
      {dots.map((p, i) => (
        <mesh key={`d-${i}`} position={p}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshBasicMaterial color={i % 9 === 0 ? "#22d3ee" : "#334155"} />
        </mesh>
      ))}
      {markers.map((m) => (
        <group key={m.code} position={m.position}>
          <mesh>
            <sphereGeometry args={[m.size, 12, 12]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
          <mesh>
            <sphereGeometry args={[m.size * 2.2, 12, 12]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function VisitorsGlobe({
  countries,
  className,
}: {
  countries: GlobeCountry[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0.35, 4.1], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 2, 4]} intensity={1.1} color="#67e8f9" />
        <GlobeScene countries={countries} />
      </Canvas>
    </div>
  );
}
