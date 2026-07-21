// @ts-nocheck
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

// hl: three.js intrinsic elements — types provided by R3F but skipped by skipLibCheck
type E<T> = T & { children?: React.ReactNode; key?: React.Key };
const m = (type: string, props: Record<string, unknown>, ...children: React.ReactNode[]) =>
  ({ type, props, children }) as any;

function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_s, d) => { if (meshRef.current) { meshRef.current.rotation.x += d * 0.1; meshRef.current.rotation.y += d * 0.15; } });
  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={meshRef as any} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
        <MeshDistortMaterial color="#f59e0b" distort={0.4} speed={1.5} roughness={0.15} metalness={0.9} />
      </mesh>
    </Float>
  );
}

function FloatingIcosahedrons() {
  const g = useRef<THREE.Group>(null);
  const count = 7;
  const positions = useMemo(() => Array.from({ length: count }, (_, i) => { const a = (i / count) * Math.PI * 2, r = 2.8 + Math.random() * 1.5; return [Math.cos(a) * r, (Math.random() - 0.5) * 3, Math.sin(a) * r - 1] as [number, number, number]; }), []);
  const sizes = useMemo(() => positions.map(() => 0.15 + Math.random() * 0.25), [positions]);
  useFrame((s, d) => { if (g.current) { g.current.rotation.y += d * 0.08; g.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.15; } });
  return (
    <group ref={g as any}>
      {positions.map((pos, i) => (
        <Float key={i} speed={1 + Math.random() * 2} rotationIntensity={0.5} floatIntensity={0.5 + Math.random() * 0.5}>
          <mesh position={pos as any}>
            <icosahedronGeometry args={[sizes[i], 0]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#fbbf24" : "#f59e0b"} metalness={0.9} roughness={0.2} emissive={i % 3 === 0 ? "#f59e0b" : "#000000"} emissiveIntensity={i % 3 === 0 ? 0.4 : 0} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 3000;
  const [pos, col] = useMemo(() => {
    const p = new Float32Array(count * 3), c = new Float32Array(count * 3), col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3, radius = 3 + Math.random() * 8, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1);
      p[i3] = radius * Math.sin(phi) * Math.cos(theta); p[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6; p[i3 + 2] = radius * Math.cos(phi);
      col.setHSL(0.1, 0.9, 0.4 + Math.random() * 0.4); c[i3] = col.r; c[i3 + 1] = col.g; c[i3 + 2] = col.b;
    }
    return [p, c];
  }, []);
  useFrame((s, d) => { if (ref.current) { ref.current.rotation.y += d * 0.02; ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.1) * 0.1; } });
  return (
    <points ref={ref as any}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={col} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#f59e0b" />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, -10, 5]} intensity={0.3} color="#fbbf24" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={50} depth={50} count={2000} factor={3} fade speed={0.5} />
      <ParticleField />
      <FloatingIcosahedrons />
      <TorusKnot />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} enableDamping dampingFactor={0.05} />
    </>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
        <Suspense fallback={null}><Scene /></Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,15,0.6) 70%)" }} />
    </div>
  );
}