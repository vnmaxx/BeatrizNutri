import { Suspense, lazy, useEffect, useRef, useState } from "react";
import SafeCanvas from "./SafeCanvas.jsx";
import { useCanRender3D } from "../three/use3d.js";
import { whatsappLink } from "../config.js";

const JourneyScene = lazy(() => import("../three/JourneyScene.jsx"));

const ACTS = [
  { t: "A consulta", d: "Tudo começa com uma avaliação individual e completa: histórico, rotina, exames e bioimpedância." },
  { t: "O seu plano", d: "Um plano alimentar feito para o seu corpo e o seu objetivo — a base do Método Reprograme, de 12 semanas." },
  { t: "A rotina", d: "Você segue no dia a dia, com hábitos sustentáveis e suporte de perto no WhatsApp. Sem dieta impossível." },
  { t: "A transformação", d: "O resultado aparece e, principalmente, se mantém. Equilíbrio que continua depois do acompanhamento." },
];

export default function Journey() {
  const can = useCanRender3D();
  const wrapRef = useRef(null);
  const progress = useRef(0);
  const [act, setAct] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1)));
      progress.current = p;
      if (rect.top < window.innerHeight && rect.bottom > 0) setMounted(true);
      const a = Math.max(0, Math.min(ACTS.length - 1, Math.floor(p * ACTS.length - 1e-6)));
      setAct(a);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="journey" ref={wrapRef} id="jornada">
      <div className="journey-sticky">
        <div className="journey-canvas">
          {can && mounted ? (
            <SafeCanvas fallback={<div className="scene-fallback" />}>
              <Suspense fallback={<div className="scene-fallback" />}>
                <JourneyScene progressRef={progress} />
              </Suspense>
            </SafeCanvas>
          ) : (
            <div className="scene-fallback" />
          )}
        </div>

        <div className="journey-overlay">
          <div className="container journey-overlay-inner">
            <div className="journey-caption">
              <span className="eyebrow">Sua jornada no Método Reprograme</span>
              <span className="journey-step">
                Etapa {act + 1} de {ACTS.length}
              </span>
              <h2 key={act} className="journey-title">
                {ACTS[act].t}
              </h2>
              <p key={`d${act}`} className="journey-desc">
                {ACTS[act].d}
              </p>
              <div className="journey-dots">
                {ACTS.map((_, i) => (
                  <i key={i} className={i === act ? "on" : ""} />
                ))}
              </div>
              <a className="btn" href={whatsappLink()} target="_blank" rel="noopener" style={{ marginTop: "8px" }}>
                Começar minha jornada
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
