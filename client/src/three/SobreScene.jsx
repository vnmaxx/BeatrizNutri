// SOBRE — escultura discreta de linhas curvas ascendentes. Significado:
// crescimento, equilíbrio e conhecimento científico que se constrói com o tempo.
// Linhas sálvia sobem em espiral suave; pequenas pontas douradas no topo.
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import Studio from "./Studio.jsx";
import { P } from "./palette.js";

const STRANDS = 5;

function curva(offset) {
  const pts = [];
  const turns = 1.4;
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const ang = offset + t * Math.PI * 2 * turns;
    const r = 0.95 * (1 - t * 0.35); // afunila ao subir
    pts.push([Math.cos(ang) * r, (t - 0.5) * 2.6, Math.sin(ang) * r]);
  }
  return pts;
}

function Ascensao() {
  const group = useRef();
  const strands = useMemo(
    () => Array.from({ length: STRANDS }, (_, i) => ({ pts: curva((i / STRANDS) * Math.PI * 2), top: curva((i / STRANDS) * Math.PI * 2).at(-1) })),
    []
  );
  useFrame((s) => {
    if (group.current) group.current.rotation.y = s.clock.elapsedTime * 0.14;
  });
  return (
    <group ref={group}>
      {strands.map((st, i) => (
        <group key={i}>
          <Line points={st.pts} color={i % 2 ? P.sage : P.sageDeep} lineWidth={1.5} transparent opacity={0.7} />
          <mesh position={st.top} scale={0.07}>
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial color={P.gold} roughness={0.45} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function SobreScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Studio intensity={0.9} />
      <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.5}>
        <Ascensao />
      </Float>
    </Canvas>
  );
}
