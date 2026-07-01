// CTA — o "portal": a forma que começou instável no hero agora é uma esfera
// estável e luminosa que se abre em anéis, convidando ao contato.
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Studio from "./Studio.jsx";
import OrganicForm from "./OrganicForm.jsx";
import { P } from "./palette.js";

function Aneis() {
  const g = useRef();
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (!g.current) return;
    g.current.children.forEach((m, i) => {
      const phase = (t * 0.25 + i / 3) % 1;
      const sc = 1.6 + phase * 2.4;
      m.scale.setScalar(sc);
      if (m.material) m.material.opacity = (1 - phase) * 0.5;
    });
  });
  return (
    <group ref={g}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.02, 10, 80]} />
          <meshBasicMaterial color={P.gold} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function CtaScene() {
  const stateRef = useRef({ stability: 1, scan: 0, assemble: 1 });
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 44 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Studio intensity={0.9} />
      <pointLight color={P.gold} position={[0, 0, 3]} intensity={2.2} distance={10} />
      <Aneis />
      <OrganicForm stateRef={stateRef} scale={1.1} />
    </Canvas>
  );
}
