import { Suspense, lazy, useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
import SafeCanvas from "./SafeCanvas.jsx";
import { useCanRender3D, useIsDesktop } from "../three/use3d.js";
import { whatsappLink } from "../config.js";

const HeroScene = lazy(() => import("../three/HeroScene.jsx"));

export default function Hero() {
  const can = useCanRender3D();
  const desktop = useIsDesktop();
  const stateRef = useRef({ stability: 0.12, scan: 0, assemble: 0 });
  const secRef = useRef(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = secRef.current;
      if (!el) return;
      const h = el.offsetHeight || 1;
      const hp = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / h));
      stateRef.current.stability = 0.12 + hp * 0.35; // começa a estabilizar ao rolar
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // resolve a distorção do título logo após montar
    const t = setTimeout(() => setResolved(true), 80);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const use3D = can && desktop;

  return (
    <section className={`hero hero-earth ${resolved ? "resolved" : ""}`} ref={secRef}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Moema e Avenida Paulista · Presencial e Online</span>
          <h1 className="hero-title">
            Para quem já tentou de tudo e quer um <span className="grad">método eficiente</span> de
            emagrecimento
          </h1>
          <p className="sub">
            Chega de efeito sanfona. Acompanhamento nutricional individualizado, com base clínica e
            foco em resultado que se mantém.
          </p>
          <div className="hero-actions">
            <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
              <Icon name="phone" size={18} />
              Falar no WhatsApp
            </a>
            <a className="btn btn-ghost" href="#jornada">
              Ver a jornada
            </a>
          </div>
          <div className="hero-trust">
            <span>
              <Icon name="user" size={18} /> Mais de <b>3.000</b> atendimentos
            </span>
            <span>
              <Icon name="shield" size={18} /> Nutrição <b>clínica e esportiva</b>
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-canvas">
            {use3D ? (
              <SafeCanvas fallback={<div className="hero-canvas-fallback" />}>
                <Suspense fallback={<div className="hero-canvas-fallback" />}>
                  <HeroScene stateRef={stateRef} />
                </Suspense>
              </SafeCanvas>
            ) : (
              <div className="hero-canvas-fallback" />
            )}
          </div>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
