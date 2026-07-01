import { Suspense, useEffect, useState } from "react";
import SafeCanvas from "./SafeCanvas.jsx";
import { useCanRender3D, useInView } from "../three/use3d.js";

// Monta uma cena 3D só quando ela entra na viewport e o ambiente suporta WebGL.
// Importa o módulo da cena sob demanda (lazy) e degrada para o fallback.
export default function Lazy3D({ load, fallback = null, className = "", style }) {
  const can = useCanRender3D();
  const [ref, inView] = useInView();
  const [Comp, setComp] = useState(null);

  useEffect(() => {
    let alive = true;
    if (can && inView && !Comp) {
      load()
        .then((mod) => {
          if (alive) setComp(() => mod.default);
        })
        .catch(() => {});
    }
    return () => {
      alive = false;
    };
  }, [can, inView, Comp, load]);

  return (
    <div ref={ref} className={className} style={style}>
      {Comp ? (
        <SafeCanvas fallback={fallback}>
          <Suspense fallback={fallback}>
            <Comp />
          </Suspense>
        </SafeCanvas>
      ) : (
        fallback
      )}
    </div>
  );
}
