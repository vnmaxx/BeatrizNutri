// JORNADA (scrollytelling) — a câmera viaja por 4 tableaux conforme a página
// rola: Consulta → Plano → Rotina → Transformação. Figuras estilizadas (não
// realistas): nutricionista de jaleco + paciente. Paleta sálvia/cerâmica/dourado.
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import Studio from "./Studio.jsx";
import { P } from "./palette.js";

// distância entre os tableaux ao longo do eixo X
const STEP = 9;
const LAST = 3;

/* ---------- Figura estilizada ---------- */
function Person({ coat = false, clothes = P.sage, skin = "#e8c9a8", hair = "#3b2a1e", seated = false, gesture = 0, ...props }) {
  const arm = useRef();
  useFrame((s) => {
    if (arm.current && gesture) arm.current.rotation.x = 0.3 + Math.sin(s.clock.elapsedTime * 1.4) * 0.22 * gesture;
  });
  const body = coat ? P.ceramic : clothes;
  const legs = coat ? "#454b46" : "#6b6f63";
  return (
    <group {...props}>
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color={skin} roughness={0.65} envMapIntensity={0.8} />
      </mesh>
      <mesh position={[0, 1.64, -0.02]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.285, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color={hair} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <capsuleGeometry args={[0.25, 0.5, 8, 16]} />
        <meshStandardMaterial color={body} roughness={0.6} envMapIntensity={0.9} />
      </mesh>
      <mesh ref={arm} position={[-0.3, 1.05, 0.05]} rotation={[0.3, 0, 0.15]}>
        <capsuleGeometry args={[0.08, 0.42, 6, 10]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 1.05, 0.05]} rotation={[0.3, 0, -0.15]}>
        <capsuleGeometry args={[0.08, 0.42, 6, 10]} />
        <meshStandardMaterial color={body} roughness={0.6} />
      </mesh>
      {seated ? (
        <mesh position={[0, 0.55, 0.2]} rotation={[1.1, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.42, 6, 10]} />
          <meshStandardMaterial color={legs} roughness={0.65} />
        </mesh>
      ) : (
        <>
          <mesh position={[-0.12, 0.4, 0]}>
            <capsuleGeometry args={[0.1, 0.55, 6, 10]} />
            <meshStandardMaterial color={legs} roughness={0.65} />
          </mesh>
          <mesh position={[0.12, 0.4, 0]}>
            <capsuleGeometry args={[0.1, 0.55, 6, 10]} />
            <meshStandardMaterial color={legs} roughness={0.65} />
          </mesh>
        </>
      )}
    </group>
  );
}

function Prancheta({ ...props }) {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.position.y = props.position[1] + Math.sin(s.clock.elapsedTime * 1.2) * 0.05;
  });
  return (
    <group ref={ref} {...props}>
      <mesh>
        <boxGeometry args={[0.42, 0.56, 0.03]} />
        <meshStandardMaterial color={P.white} roughness={0.5} envMapIntensity={1} />
      </mesh>
      <mesh position={[0, 0.12, 0.02]}>
        <boxGeometry args={[0.28, 0.03, 0.01]} />
        <meshStandardMaterial color={P.gold} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0.02]}>
        <boxGeometry args={[0.28, 0.02, 0.01]} />
        <meshStandardMaterial color={P.sage} />
      </mesh>
      <mesh position={[0, -0.06, 0.02]}>
        <boxGeometry args={[0.2, 0.02, 0.01]} />
        <meshStandardMaterial color={P.sage} />
      </mesh>
    </group>
  );
}

/* ---------- Tableau 1: Consulta ---------- */
function Consulta(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.72, 0.35]}>
        <boxGeometry args={[2.3, 0.12, 1]} />
        <meshStandardMaterial color={P.beige} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0.35]}>
        <boxGeometry args={[2.05, 0.62, 0.86]} />
        <meshStandardMaterial color={P.bone} roughness={0.85} />
      </mesh>
      <Person coat seated position={[0.5, 0, -0.5]} rotation={[0, -0.5, 0]} gesture={1} hair="#4a3526" />
      <Person seated clothes={P.sage} position={[-0.65, 0, 1.15]} rotation={[0, 2.35, 0]} hair="#22201d" />
      <Prancheta position={[0.15, 1.25, 0.15]} />
    </group>
  );
}

/* ---------- Tableau 2: Plano (12 semanas / etapas) ---------- */
function Plano(props) {
  const dot = useRef();
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.6, 0.6, 0),
    new THREE.Vector3(-0.5, 1.3, 0.3),
    new THREE.Vector3(0.7, 0.7, -0.3),
    new THREE.Vector3(1.7, 1.5, 0),
  ]);
  const pts = curve.getPoints(80).map((p) => [p.x, p.y, p.z]);
  const nodes = [curve.getPoint(0), curve.getPoint(0.33), curve.getPoint(0.66), curve.getPoint(1)];
  useFrame((s) => {
    if (dot.current) {
      const u = (s.clock.elapsedTime * 0.12) % 1;
      const p = curve.getPoint(u);
      dot.current.position.set(p.x, p.y, p.z);
    }
  });
  return (
    <group {...props}>
      <Line points={pts} color={P.sageDeep} lineWidth={1.6} transparent opacity={0.7} />
      {nodes.map((n, i) => (
        <mesh key={i} position={[n.x, n.y, n.z]} scale={0.2}>
          <boxGeometry args={[1, 1.3, 0.14]} />
          <meshStandardMaterial color={i === 3 ? P.gold : P.ceramic} roughness={i === 3 ? 0.5 : 0.4} metalness={i === 3 ? 0.4 : 0} envMapIntensity={1.1} />
        </mesh>
      ))}
      <mesh ref={dot} scale={0.09}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color={P.gold} roughness={0.4} metalness={0.5} emissive={P.goldDeep} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* ---------- Tableau 3: Rotina (dia a dia) ---------- */
function Rotina(props) {
  const sun = useRef();
  const person = useRef();
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (sun.current) {
      sun.current.position.x = Math.cos(t * 0.4 + Math.PI) * 1.8;
      sun.current.position.y = 1.6 + Math.sin(t * 0.4) * 0.9;
    }
    if (person.current) person.current.position.y = Math.abs(Math.sin(t * 1.6)) * 0.06; // passos leves
  });
  return (
    <group {...props}>
      {/* arco do dia */}
      <Line
        points={Array.from({ length: 40 }, (_, i) => {
          const a = Math.PI * (i / 39);
          return [Math.cos(Math.PI - a) * 1.8, 1.6 + Math.sin(a) * 0.9 - 0.9, 0];
        })}
        color={P.beige}
        lineWidth={1.2}
        transparent
        opacity={0.5}
        dashed
        dashScale={4}
      />
      <mesh ref={sun}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshStandardMaterial color={P.gold} roughness={0.5} metalness={0.4} emissive={P.gold} emissiveIntensity={0.2} />
      </mesh>
      <group ref={person}>
        <Person clothes={P.olive} position={[0, 0, 0]} rotation={[0, 0.3, 0]} hair="#22201d" gesture={0.6} />
      </group>
      {/* trilha de passos */}
      {[-1.2, -0.7, -0.2, 0.3, 0.8, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0.5 + (i % 2) * 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.09, 16]} />
          <meshStandardMaterial color={P.sage} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Tableau 4: Transformação ---------- */
function Resultado(props) {
  const orb = useRef();
  useFrame((s) => {
    if (orb.current) {
      orb.current.rotation.y = s.clock.elapsedTime * 0.5;
      orb.current.position.y = 1.7 + Math.sin(s.clock.elapsedTime * 1.1) * 0.08;
    }
  });
  return (
    <group {...props}>
      <Person clothes={P.sage} position={[-0.45, 0, 0.1]} rotation={[0, 0.4, 0]} hair="#22201d" gesture={0.4} />
      <Person coat position={[0.7, 0, -0.1]} rotation={[0, -0.5, 0]} hair="#4a3526" gesture={0.5} />
      <mesh ref={orb} position={[0.1, 1.7, 0.4]} scale={0.24}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color={P.gold} roughness={0.45} metalness={0.5} envMapIntensity={1.2} />
      </mesh>
      {/* halo de conclusão */}
      <mesh position={[0.1, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.02, 12, 60]} />
        <meshStandardMaterial color={P.sage} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Chao() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[STEP * 1.5, -0.02, 0]}>
      <planeGeometry args={[STEP * 5, 8]} />
      <meshStandardMaterial color={P.bone} roughness={0.95} />
    </mesh>
  );
}

function Story({ progressRef }) {
  const p = useRef(0);
  useFrame((state, dt) => {
    // suaviza o progresso vindo do scroll
    p.current += (progressRef.current - p.current) * Math.min(1, dt * 3.2);
    const x = p.current * STEP * LAST;
    const cam = state.camera;
    cam.position.x += (x - cam.position.x) * 0.12;
    cam.position.y += (1.5 - cam.position.y) * 0.12;
    cam.position.z += (6.2 - cam.position.z) * 0.12;
    cam.lookAt(x, 1.15, 0);
  });
  return (
    <>
      <Chao />
      <Consulta position={[0, 0, 0]} />
      <Plano position={[STEP, 0, 0]} />
      <Rotina position={[STEP * 2, 0, 0]} />
      <Resultado position={[STEP * 3, 0, 0]} />
    </>
  );
}

export default function JourneyScene({ progressRef }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 6.2], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={[P.ceramic]} />
      <fog attach="fog" args={[P.ceramic, 5.5, 15]} />
      <Studio />
      <Story progressRef={progressRef} />
    </Canvas>
  );
}
