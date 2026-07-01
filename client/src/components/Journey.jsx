import { Suspense, lazy, useEffect, useRef, useState } from "react";
import SafeCanvas from "./SafeCanvas.jsx";
import { useCanRender3D, useIsDesktop } from "../three/use3d.js";
import { whatsappLink } from "../config.js";

const JourneyScene = lazy(() => import("../three/JourneyScene.jsx"));

const ACTS = [
  { t: "Primeiro contato", d: "Você chama no WhatsApp e conta seu objetivo. Surge o primeiro passo da sua reprogramação." },
  { t: "Avaliação completa", d: "Anamnese, exames e bioimpedância: entendemos o seu corpo por dentro, sem achismo." },
  { t: "Plano individualizado", d: "As peças se encaixam. Um plano feito para a sua rotina — a base do Método Reprograme, de 12 semanas." },
  { t: "A transformação", d: "A instabilidade do efeito sanfona dá lugar ao equilíbrio. Um resultado que permanece." },
];

export default function Journey() {
  const can = useCanRender3D();
  const desktop = useIsDesktop();
  const wrapRef = useRef(null);
  const progress = useRef(0);
  const [act, setAct] = useState(0);
  const [pct, setPct] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1)));
      progress.current = p;
      setPct(p);
      if (rect.top < window.innerHeight && rect.bottom > 0) setMounted(true);
      setAct(Math.max(0, Math.min(ACTS.length - 1, Math.floor(p * ACTS.length - 1e-6))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const use3D = can && desktop;

  return (
    <section className="journey" ref={wrapRef} id="jornada">
      <div className="journey-sticky">
        <div className="journey-canvas">
          {use3D && mounted ? (
            <SafeCanvas fallback={<div className="journey-fallback" />}>
              <Suspense fallback={<div className="journey-fallback" />}>
                <JourneyScene progressRef={progress} />
              </Suspense>
            </SafeCanvas>
          ) : (
            <div className="journey-fallback" data-act={act} />
          )}
        </div>

        <div className="journey-overlay">
          <div className="container journey-overlay-inner">
            <div className="journey-caption">
              <span className="eyebrow">A Reprogramação · jornada de 12 semanas</span>
              <div className="journey-progress">
                <span className="journey-step">
                  Etapa {act + 1} de {ACTS.length}
                </span>
                <div className="journey-bar">
                  <div className="journey-bar-fill" style={{ width: `${Math.round((pct * 0.9 + (act + 1) / ACTS.length * 0.1) * 100)}%` }} />
                </div>
              </div>
              <h2 key={act} className="journey-title">
                {ACTS[act].t}
              </h2>
              <p key={`d${act}`} className="journey-desc">
                {ACTS[act].d}
              </p>
              <div className="journey-dots">
                {ACTS.map((_, i) => (
                  <i key={i} className={i <= act ? "on" : ""} />
                ))}
              </div>
              <a className="btn" href={whatsappLink()} target="_blank" rel="noopener" style={{ marginTop: "6px" }}>
                Começar minha jornada
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
