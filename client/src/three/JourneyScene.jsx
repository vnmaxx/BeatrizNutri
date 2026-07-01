// "A REPROGRAMAÇÃO" — a forma orgânica atravessa 4 estações conforme o scroll:
// 1 Primeiro contato (surge um ponto de luz) · 2 Avaliação (varredura/bioimpedância)
// · 3 Plano (peças se encaixam) · 4 Transformação (forma estável e luminosa).
// A câmera avança por anéis-portal; a forma sai de instável (terracota) a
// estável (sálvia/dourado). O progresso vem do scroll (progressRef 0..1).
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Studio from "./Studio.jsx";
import OrganicForm from "./OrganicForm.jsx";
import { P } from "./palette.js";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (v) => v * v * (3 - 2 * v);
// "pulso" 0→1→0 dentro de uma janela [a,b]
function bump(p, a, b) {
  if (p <= a || p >= b) return 0;
  const m = (a + b) / 2;
  return p < m ? smooth((p - a) / (m - a)) : smooth((b - p) / (b - m));
}

function Portais({ pref }) {
  const group = useRef();
  const rings = useMemo(() => [0, 1, 2, 3].map((i) => ({ z: -i * 6 })), []);
  useFrame((s) => {
    const p = pref.current;
    if (group.current) {
      // os anéis vêm em direção à câmera conforme o progresso (atravessar portais)
      group.current.position.z = p * 18;
      group.current.rotation.z = s.clock.elapsedTime * 0.05;
    }
  });
  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} position={[0, 0, r.z]} rotation={[0, 0, i * 0.4]}>
          <torusGeometry args={[2.4 + i * 0.15, 0.02, 10, 80]} />
          <meshStandardMaterial color={i === 3 ? P.gold : P.sage} roughness={0.5} metalness={0.3} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Story({ progressRef }) {
  const p = useRef(0);
  const stateRef = useRef({ stability: 0, scan: 0, assemble: 0 });
  const light = useRef();

  useFrame((state, dt) => {
    p.current += (progressRef.current - p.current) * Math.min(1, dt * 3);
    const P0 = p.current;
    // fio condutor: estabilidade cresce ao longo da jornada
    stateRef.current.stability = smooth(clamp01((P0 - 0.12) / 0.85));
    stateRef.current.scan = bump(P0, 0.25, 0.52); // estação 2
    stateRef.current.assemble = smooth(clamp01((P0 - 0.5) / 0.32)); // estação 3→4

    // ponto de luz do "primeiro contato" surge no começo e depois integra
    if (light.current) {
      const l = bump(P0, 0.0, 0.3) * 0.6 + stateRef.current.stability * 0.9;
      light.current.intensity = l * 2.4;
      light.current.position.set(Math.cos(state.clock.elapsedTime * 0.4) * 1.6, 0.6, 2.4);
    }

    // leve dolly de câmera para dar profundidade
    const cam = state.camera;
    cam.position.x += (0 - cam.position.x) * 0.1;
    cam.position.y += (0 - cam.position.y) * 0.1;
    cam.position.z += (5.4 - cam.position.z) * 0.1;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <pointLight ref={light} color={P.gold} intensity={0} distance={9} />
      <Portais pref={p} />
      <OrganicForm stateRef={stateRef} scale={1.25} />
    </>
  );
}

export default function JourneyScene({ progressRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={[P.earth]} />
      <fog attach="fog" args={[P.earth, 6, 20]} />
      <Studio intensity={0.8} />
      <Story progressRef={progressRef} />
    </Canvas>
  );
}
