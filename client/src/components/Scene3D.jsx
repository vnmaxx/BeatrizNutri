import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Torus, Sphere } from "@react-three/drei";

// Paleta da marca (verde nutrição).
const VERDE = "#3a8a5f";
const VERDE_CLARO = "#7fc79b";
const VERDE_ESCURO = "#2c6b49";

// Blob orgânico central — distorção suave e contínua.
function Blob() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.18;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
      <Icosahedron ref={ref} args={[1.5, 12]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={VERDE}
          emissive={VERDE_ESCURO}
          emissiveIntensity={0.18}
          roughness={0.28}
          metalness={0.32}
          distort={0.38}
          speed={1.6}
        />
      </Icosahedron>
    </Float>
  );
}

function Satelite({ position, scale, kind, color, speed = 1 }) {
  const Geo = kind === "torus" ? Torus : Sphere;
  const args = kind === "torus" ? [0.5, 0.2, 24, 64] : [0.5, 32, 32];
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.6}>
      <Geo args={args} position={position} scale={scale}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} emissive={color} emissiveIntensity={0.08} />
      </Geo>
    </Float>
  );
}

// Grupo que segue suavemente o ponteiro (parallax).
function Parallax({ children }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const x = state.pointer.x * 0.35;
    const y = state.pointer.y * 0.25;
    ref.current.rotation.y += (x - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-y - ref.current.rotation.x) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -2, -3]} intensity={2.4} color={VERDE_CLARO} />
        <pointLight position={[3, -4, 2]} intensity={1.2} color={VERDE} />
        <Parallax>
          <Blob />
          <Satelite position={[2.4, 1.2, -1]} scale={0.6} kind="sphere" color={VERDE_CLARO} speed={1.3} />
          <Satelite position={[-2.6, -1.1, -0.5]} scale={0.5} kind="torus" color={VERDE} speed={0.9} />
          <Satelite position={[2.1, -1.6, 0.5]} scale={0.4} kind="sphere" color={VERDE_ESCURO} speed={1.6} />
          <Satelite position={[-2.2, 1.6, 0]} scale={0.34} kind="sphere" color={VERDE_CLARO} speed={1.1} />
        </Parallax>
      </Suspense>
    </Canvas>
  );
}
