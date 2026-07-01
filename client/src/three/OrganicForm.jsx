// A "forma orgânica" — personagem central do site. Começa INSTÁVEL (efeito
// sanfona: muita distorção, balanço pendular, cor terracota) e vai ficando
// ESTÁVEL (pouca distorção, equilíbrio, sálvia/dourado luminoso).
// O estado é lido de um ref { stability, scan, assemble } (0..1) para poder ser
// dirigido pelo scroll. Não inclui <Canvas> — é usada dentro de cenas.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { P } from "./palette.js";

const C_TERRA = new THREE.Color(P.terra);
const C_SAGE = new THREE.Color(P.sage);
const C_BLACK = new THREE.Color("#000000");
const C_GOLD = new THREE.Color(P.gold);

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export default function OrganicForm({ stateRef, scale = 1.2 }) {
  const grp = useRef();
  const mesh = useRef();
  const mat = useRef();
  const scan = useRef();

  const bits = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const y = Math.sin(i * 1.7) * 1.1;
        const r = 1.15;
        return {
          target: new THREE.Vector3(Math.cos(a) * r, y * 0.7, Math.sin(a) * r),
          scattered: new THREE.Vector3(Math.cos(a) * 3.4, y * 2.2, Math.sin(a) * 3.4 - 1),
          spin: 0.3 + (i % 3) * 0.15,
        };
      }),
    []
  );
  const bitRefs = useRef([]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const st = stateRef?.current || {};
    const stab = clamp01(st.stability ?? 0);
    const scn = clamp01(st.scan ?? 0);
    const asm = clamp01(st.assemble ?? 0);
    const inst = 1 - stab; // instabilidade

    if (grp.current) {
      grp.current.rotation.z = Math.sin(t * 1.05) * 0.5 * inst; // balanço pendular
      grp.current.rotation.y = t * 0.14;
      grp.current.position.y = Math.sin(t * 0.8) * 0.14 * inst;
    }
    if (mesh.current) {
      const wobble = 1 + Math.sin(t * 2.1) * 0.07 * inst;
      mesh.current.scale.setScalar(scale * wobble);
    }
    if (mat.current) {
      mat.current.distort = 0.5 * inst + 0.05;
      mat.current.speed = 2.2 * inst + 0.4;
      mat.current.color.copy(C_TERRA).lerp(C_SAGE, stab);
      mat.current.emissive.copy(C_BLACK).lerp(C_GOLD, stab * 0.85);
      mat.current.emissiveIntensity = 0.04 + stab * 0.5;
    }
    // linha de "bioimpedância" varrendo verticalmente
    if (scan.current) {
      scan.current.visible = scn > 0.03;
      scan.current.position.y = -1.3 + ((t * 0.9) % 2.6);
      scan.current.material.opacity = scn * 0.85;
      scan.current.scale.setScalar(scale);
    }
    // peças se encaixando
    bitRefs.current.forEach((m, i) => {
      if (!m) return;
      const b = bits[i];
      m.visible = asm > 0.02;
      m.position.lerpVectors(b.scattered, b.target, asm);
      m.rotation.x = t * b.spin;
      m.rotation.y = t * b.spin * 0.8;
      const sc = (0.06 + asm * 0.05) * scale;
      m.scale.setScalar(sc);
      if (m.material) m.material.opacity = Math.min(1, asm * 1.4) * (1 - stab * 0.4);
    });
  });

  return (
    <group ref={grp}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 20]} />
        <MeshDistortMaterial
          ref={mat}
          color={P.terra}
          emissive={"#000000"}
          roughness={0.32}
          metalness={0.12}
          distort={0.5}
          speed={2.2}
          envMapIntensity={0.9}
        />
      </mesh>

      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[1.35, 0.015, 8, 72]} />
        <meshBasicMaterial color={P.sage} transparent opacity={0} />
      </mesh>

      {bits.map((_, i) => (
        <mesh key={i} ref={(el) => (bitRefs.current[i] = el)} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={i % 2 ? P.ceramic : P.gold} roughness={0.4} metalness={0.2} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}
