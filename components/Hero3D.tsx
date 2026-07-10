'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, Leaf, Radar, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';

function LeafMesh() {
  const mesh = useRef<THREE.Mesh>(null);
  const shape = useMemo(() => {
    const leaf = new THREE.Shape();
    leaf.moveTo(0, -1.6);
    leaf.bezierCurveTo(-1.35, -0.75, -1.2, 0.85, 0, 1.65);
    leaf.bezierCurveTo(1.2, 0.85, 1.35, -0.75, 0, -1.6);
    return leaf;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.28;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
  });

  return (
    <group>
      <mesh ref={mesh} rotation={[0.22, 0, -0.18]} scale={[1.25, 1.25, 1.25]}>
        <shapeGeometry args={[shape, 72]} />
        <meshStandardMaterial color="#20f46d" emissive="#095d2a" roughness={0.38} metalness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.03]} rotation={[0.22, 0, -0.18]} scale={[1.25, 1.25, 1.25]}>
        <boxGeometry args={[0.045, 2.8, 0.025]} />
        <meshStandardMaterial color="#b8ff5c" emissive="#315f11" />
      </mesh>
    </group>
  );
}

function ScannerRings() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = state.clock.elapsedTime * 0.24;
  });
  return (
    <group ref={group} position={[0, -1.75, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
      {[0.8, 1.15, 1.5].map((radius, index) => (
        <mesh key={radius}>
          <torusGeometry args={[radius, 0.012, 12, 120]} />
          <meshBasicMaterial color={index === 1 ? '#52ff7a' : '#16f66a'} transparent opacity={0.62 - index * 0.12} />
        </mesh>
      ))}
    </group>
  );
}

function Beam() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 1.25;
  });
  return (
    <mesh ref={mesh} position={[0, 0, 0.25]}>
      <boxGeometry args={[3.2, 0.035, 0.02]} />
      <meshBasicMaterial color="#52ff7a" transparent opacity={0.7} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#e9ffe9" />
      <pointLight position={[-2, 1, 2]} intensity={3} color="#16f66a" />
      <ScannerRings />
      <LeafMesh />
      <Beam />
    </>
  );
}

export default function Hero3D() {
  return (
    <Card className="relative min-h-[560px] overflow-hidden p-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(82,255,122,0.18),transparent_35%),linear-gradient(135deg,rgba(3,27,18,0.85),rgba(0,0,0,0.35))]" />
      <div className="absolute inset-0 scanner-grid opacity-30" />
      <Canvas camera={{ position: [0, 0, 6], fov: 42 }} className="absolute inset-0">
        <Scene />
      </Canvas>

      <div className="pointer-events-none absolute inset-5 rounded-3xl border border-emerald-400/20 scanner-corners" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-black/35 px-3 py-2 text-xs font-bold text-emerald-50 backdrop-blur-xl">
        <span className="h-2 w-2 rounded-full bg-crop-neon shadow-glow" /> Live AI Crop Scanner
      </div>
      <div className="absolute right-5 top-5 rounded-full border border-emerald-400/20 bg-black/35 px-3 py-2 text-xs font-bold text-crop-neon backdrop-blur-xl">
        Gemini Vision Ready
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-3"
      >
        <DashboardTile icon={Leaf} label="Possible Disease" value="AI advisory" sub="No final diagnosis" />
        <DashboardTile icon={Activity} label="Severity" value="Qualitative" sub="Healthy → Critical" />
        <DashboardTile icon={ShieldCheck} label="Risk" value="Safety-first" sub="Expert warning" />
      </motion.div>

      <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {[Radar, Sparkles, AlertTriangle].map((Icon, index) => (
          <div key={index} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-black/35 text-crop-neon backdrop-blur-xl">
            <Icon className="h-5 w-5" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function DashboardTile({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-emerald-400/18 bg-black/35 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-50/55">
        <Icon className="h-4 w-4 text-crop-neon" />
        {label}
      </div>
      <p className="mt-2 font-black text-white">{value}</p>
      <p className="text-xs text-emerald-50/50">{sub}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-premium-gradient" />
      </div>
    </div>
  );
}
