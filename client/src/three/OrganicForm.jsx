// A "forma orgânica" — personagem central do site. Começa INSTÁVEL (efeito
// sanfona: muita distorção, balanço pendular, cor terracota) e vai ficando
// ESTÁVEL (pouca distorção, equilíbrio, sálvia/dourado luminoso).
// Estado lido de um ref { stability, scan, assemble } (0..1), dirigido pelo scroll.
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

// Nuvem de partículas puxada para dentro da forma conforme `assemble` cresce.
function Particulas({ stateRef, scale = 1.2, count = 420 }) {
  const points = useRef();
  const matRef = useRef();

  const { positions, target, scattered, radBase } = useMemo(() => {
    const R = 1.28 * scale;
    const positions = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const scattered = new Float32Array(count * 3);
    const radBase = new Float32Array(count);
    const GA = Math.PI * (3 - Math.sqrt(5)); // ângulo áureo
    for (let i = 0; i < count; i++) {
      // alvo: distribuição uniforme na superfície (fibonacci sphere)
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * GA;
      const tx = Math.cos(theta) * r * R;
      const ty = y * R;
      const tz = Math.sin(theta) * r * R;
      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;
      // início: mesma direção, porém longe (nuvem dispersa)
      const far = 2.6 + Math.sin(i * 12.9898) * 0.5 + 1.2;
      scattered[i * 3] = tx * far;
      scattered[i * 3 + 1] = ty * far + Math.sin(i) * 0.6;
      scattered[i * 3 + 2] = tz * far;
      radBase[i] = far;
      positions[i * 3] = scattered[i * 3];
      positions[i * 3 + 1] = scattered[i * 3 + 1];
      positions[i * 3 + 2] = scattered[i * 3 + 2];
    }
    return { positions, target, scattered, radBase };
  }, [count, scale]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const st = stateRef?.current || {};
    const asm = clamp01(st.assemble ?? 0);
    const stab = clamp01(st.stability ?? 0);
    const pull = asm * asm * (3 - 2 * asm); // easing

    const geo = points.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // gira a origem dispersa (espiral) — mais rápida quanto mais longe
      const ang = t * (0.5 + (radBase[i] - 3) * 0.25) * (1 - pull * 0.85) + i * 0.35;
      const c = Math.cos(ang);
      const sN = Math.sin(ang);
      const sx = scattered[ix] * c - scattered[ix + 2] * sN;
      const sz = scattered[ix] * sN + scattered[ix + 2] * c;
      const sy = scattered[ix + 1] + Math.sin(t * 1.2 + i) * 0.15 * (1 - pull);
      // puxa em direção ao alvo na superfície
      arr[ix] = sx + (target[ix] - sx) * pull;
      arr[ix + 1] = sy + (target[ix + 1] - sy) * pull;
      arr[ix + 2] = sz + (target[ix + 2] - sz) * pull;
    }
    geo.attributes.position.needsUpdate = true;

    if (matRef.current) {
      // aparecem ao serem puxadas; ao assentar (forma estável) integram-se
      matRef.current.opacity = Math.min(1, asm * 1.3) * (1 - stab * 0.45) * 0.9;
      matRef.current.size = (0.045 + (1 - pull) * 0.02) * scale;
    }
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={P.gold}
        size={0.05 * scale}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function OrganicForm({ stateRef, scale = 1.2 }) {
  const grp = useRef();
  const mesh = useRef();
  const mat = useRef();
  const scan = useRef();

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const st = stateRef?.current || {};
    const stab = clamp01(st.stability ?? 0);
    const scn = clamp01(st.scan ?? 0);
    const inst = 1 - stab;

    if (grp.current) {
      grp.current.rotation.z = Math.sin(t * 1.05) * 0.5 * inst;
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
    if (scan.current) {
      scan.current.visible = scn > 0.03;
      scan.current.position.y = -1.3 + ((t * 0.9) % 2.6);
      scan.current.material.opacity = scn * 0.85;
      scan.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
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
      </group>
      <Particulas stateRef={stateRef} scale={scale} />
    </group>
  );
}
