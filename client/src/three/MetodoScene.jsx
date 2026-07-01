// MÉTODO REPROGRAME — quatro etapas conectadas (avaliação, planejamento,
// acompanhamento, resultado) numa estrutura 3D ascendente. Um ponto dourado
// percorre o caminho continuamente: existe um processo, e ele evolui.
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";
import Studio from "./Studio.jsx";
import { P } from "./palette.js";

const NODES = [
  [-3.2, -0.7, 0],
  [-1.05, 0.15, 0.4],
  [1.05, -0.2, -0.4],
  [3.2, 0.85, 0],
];

function Caminho() {
  const dot = useRef();
  const orbs = useRef([]);

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(NODES.map((n) => new THREE.Vector3(...n)), false, "catmullrom", 0.5),
    []
  );
  const linePoints = useMemo(() => curve.getPoints(120).map((p) => [p.x, p.y, p.z]), [curve]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const u = (t * 0.08) % 1; // ponto dourado avançando
    if (dot.current) {
      const p = curve.getPoint(u);
      dot.current.position.set(p.x, p.y, p.z);
    }
    // etapas pulsam em sequência conforme o ponto se aproxima
    orbs.current.forEach((m, i) => {
      if (!m) return;
      const center = (i + 0.5) / NODES.length;
      const near = 1 - Math.min(Math.abs(u - i / (NODES.length - 1)), 0.5) * 2;
      const b = 1 + Math.max(0, near) * 0.12 + Math.sin(t * 0.6 + i) * 0.02;
      m.scale.setScalar(0.26 * b);
      void center;
    });
  });

  return (
    <group>
      <Line points={linePoints} color={P.sageDeep} lineWidth={1.6} transparent opacity={0.6} />
      {NODES.map((n, i) => (
        <mesh key={i} position={n} ref={(el) => (orbs.current[i] = el)} scale={0.26}>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial
            color={i === NODES.length - 1 ? P.gold : P.ceramic}
            roughness={i === NODES.length - 1 ? 0.5 : 0.35}
            metalness={i === NODES.length - 1 ? 0.45 : 0}
            transparent
            opacity={0.9}
            envMapIntensity={1.1}
          />
        </mesh>
      ))}
      <mesh ref={dot} scale={0.1}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color={P.gold} roughness={0.4} metalness={0.5} emissive={P.goldDeep} emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

export default function MetodoScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 40 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Studio />
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.35}>
        <Caminho />
      </Float>
    </Canvas>
  );
}
