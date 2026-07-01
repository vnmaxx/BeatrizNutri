// Iluminação editorial reutilizável: luz natural suave + ambiente "estúdio"
// construído com Lightformers (sem HDR externo — rápido e offline-safe). Dá
// reflexos discretos de cerâmica/vidro fosco aos materiais.
import { Environment, Lightformer } from "@react-three/drei";
import { P } from "./palette.js";

export default function Studio({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.55 * intensity} />
      <directionalLight position={[4, 6, 5]} intensity={1.1 * intensity} color={P.white} />
      <directionalLight position={[-5, 2, -2]} intensity={0.35 * intensity} color={P.bone} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color={P.white} scale={[9, 9, 1]} position={[0, 5, 3]} />
        <Lightformer form="rect" intensity={1.1} color={P.bone} scale={[7, 7, 1]} position={[-5, 1, 2]} />
        <Lightformer form="circle" intensity={1.3} color={P.sage} scale={[5, 5, 1]} position={[5, -2, 2]} />
        <Lightformer form="circle" intensity={0.8} color={P.gold} scale={[3, 3, 1]} position={[2, 3, -3]} />
      </Environment>
    </>
  );
}
