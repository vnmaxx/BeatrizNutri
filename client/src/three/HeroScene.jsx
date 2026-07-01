// HERO — a forma orgânica instável (efeito sanfona) em ambiente terroso.
// A estabilidade é dirigida pelo scroll do hero (stateRef), começando a se
// resolver conforme o usuário rola.
import { Canvas } from "@react-three/fiber";
import Studio from "./Studio.jsx";
import OrganicForm from "./OrganicForm.jsx";
import { P } from "./palette.js";

export default function HeroScene({ stateRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 44 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Studio intensity={0.7} />
      <pointLight color={P.gold} position={[2.5, 1.2, 3]} intensity={1.6} distance={12} />
      <pointLight color={P.terra} position={[-3, -1, 1]} intensity={1.1} distance={12} />
      <OrganicForm stateRef={stateRef} scale={1.4} />
    </Canvas>
  );
}
