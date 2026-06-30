import { Suspense, lazy, useEffect, useState } from "react";
import Icon from "./Icon.jsx";
import SafeCanvas from "./SafeCanvas.jsx";
import { whatsappLink } from "../config.js";

const Scene3D = lazy(() => import("./Scene3D.jsx"));

export default function Hero() {
  // Só monta o WebGL no cliente e em telas que o suportam (degrada com elegância).
  const [canRender3D, setCanRender3D] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setCanRender3D(ok && !reduced);
    } catch {
      setCanRender3D(false);
    }
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Moema e Avenida Paulista · Presencial e Online</span>
          <h1>
            Para quem já tentou de tudo e quer um <span className="grad">método eficiente</span> de
            emagrecimento
          </h1>
          <p className="sub">
            Acompanhamento nutricional individualizado, com base clínica e foco em resultado que se
            mantém. Nutrição que entende o seu corpo, a sua rotina e o seu objetivo.
          </p>
          <div className="hero-actions">
            <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
              <Icon name="phone" size={18} />
              Falar no WhatsApp
            </a>
            <a className="btn btn-outline" href="#metodo">
              Conhecer o método
            </a>
          </div>
          <div className="hero-trust">
            <span>
              <Icon name="user" size={18} /> Mais de <b>3.000</b> atendimentos
            </span>
            <span>
              <Icon name="shield" size={18} /> Nutrição <b>clínica e esportiva</b>
            </span>
            <span>
              <Icon name="monitor" size={18} /> Presencial e <b>online</b>
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-canvas">
            {canRender3D && (
              <SafeCanvas fallback={<div className="hero-canvas-fallback" />}>
                <Suspense fallback={<div className="hero-canvas-fallback" />}>
                  <Scene3D />
                </Suspense>
              </SafeCanvas>
            )}
          </div>
          <div className="hero-badge-card">
            <span className="ic">
              <Icon name="shield" size={22} />
            </span>
            <span>
              <b>Pós-graduada em Endocrinologia e Metabologia</b>
              <br />
              Nutrição Clínica Funcional
            </span>
          </div>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
