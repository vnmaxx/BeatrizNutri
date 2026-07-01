// HERO — escultura abstrata de camadas orgânicas translúcidas.
// Significado: metabolismo, equilíbrio interno e composição corporal em
// transformação gradual. As camadas "respiram" e evoluem lentamente; um pequeno
// núcleo dourado no topo representa o ponto de equilíbrio (o resultado).
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import Studio from "./Studio.jsx";
import { P } from "./palette.js";

function Camadas() {
  const group = useRef();
  const N = 6;
  const layers = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const k = i / (N - 1);
        return {
          y: (k - 0.5) * 2.1,
          radius: 1.55 - k * 0.92, // afina em direção ao topo (composição mudando)
          color: i % 3 === 0 ? P.sage : i % 3 === 1 ? P.ceramic : P.olive,
          phase: i * 0.7,
        };
      }),
    []
  );

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (!group.current) return;
    group.current.rotation.y = t * 0.12;
    group.current.children.forEach((child, i) => {
      const l = layers[i];
      if (!l) return;
      child.position.y = l.y + Math.sin(t * 0.6 + l.phase) * 0.045; // respiração
      child.rotation.y = t * 0.08 * (i % 2 ? 1 : -1);
      const b = 1 + Math.sin(t * 0.5 + l.phase) * 0.03;
      child.scale.set(l.radius * b, 0.17, l.radius * b);
    });
  });

  return (
    <group ref={group}>
      {layers.map((l, i) => (
        <mesh key={i} position={[0, l.y, 0]} scale={[l.radius, 0.17, l.radius]}>
          <sphereGeometry args={[1, 64, 48]} />
          <meshStandardMaterial
            color={l.color}
            roughness={0.32}
            metalness={0}
            transparent
            opacity={0.62}
            envMapIntensity={1.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function NucleoEquilibrio() {
  return (
    <Float speed={1.1} floatIntensity={0.7} rotationIntensity={0.4}>
      <mesh position={[0, 1.35, 0]} scale={0.17}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={P.gold} roughness={0.5} metalness={0.5} envMapIntensity={1} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 6.6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Studio />
      <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.5}>
        <Camadas />
        <NucleoEquilibrio />
      </Float>
    </Canvas>
  );
}
