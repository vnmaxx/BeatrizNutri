// CONTATO — caminhos que convergem para um único ponto. Significado: conexão
// humana e acompanhamento individualizado — vários caminhos, um cuidado único.
// Pequenos pulsos percorrem cada caminho em direção ao centro (núcleo dourado).
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";
import Studio from "./Studio.jsx";
import { P } from "./palette.js";

const PATHS = 6;
const CENTER = new THREE.Vector3(0, 0, 0.4);

function buildCurve(i) {
  const ang = (i / PATHS) * Math.PI * 2;
  const start = new THREE.Vector3(Math.cos(ang) * 2.6, Math.sin(ang) * 1.6, -1.2);
  const mid = new THREE.Vector3(Math.cos(ang) * 1.1, Math.sin(ang) * 0.7, -0.2);
  return new THREE.CatmullRomCurve3([start, mid, CENTER]);
}

function Convergencia() {
  const dots = useRef([]);
  const curves = useMemo(() => Array.from({ length: PATHS }, (_, i) => buildCurve(i)), []);
  const linePoints = useMemo(() => curves.map((c) => c.getPoints(50).map((p) => [p.x, p.y, p.z])), [curves]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    dots.current.forEach((m, i) => {
      if (!m) return;
      const u = (t * 0.16 + i / PATHS) % 1;
      const p = curves[i].getPoint(u);
      m.position.set(p.x, p.y, p.z);
      m.scale.setScalar(0.05 + (1 - u) * 0.05); // cresce ao se aproximar do centro
    });
  });

  return (
    <group>
      {linePoints.map((pts, i) => (
        <Line key={i} points={pts} color={i % 2 ? P.sage : P.sageDeep} lineWidth={1.3} transparent opacity={0.55} />
      ))}
      {curves.map((_, i) => (
        <mesh key={i} ref={(el) => (dots.current[i] = el)} scale={0.06}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={P.sage} roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
      <Float speed={1.2} floatIntensity={0.5} rotationIntensity={0.3}>
        <mesh position={CENTER} scale={0.26}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial color={P.gold} roughness={0.45} metalness={0.5} envMapIntensity={1.1} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ContatoScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Studio intensity={0.95} />
      <Convergencia />
    </Canvas>
  );
}
