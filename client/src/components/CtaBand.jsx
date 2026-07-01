import Icon from "./Icon.jsx";
import Lazy3D from "./Lazy3D.jsx";
import { whatsappLink } from "../config.js";

export default function CtaBand() {
  return (
    <section className="section cta-section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band">
          <Lazy3D
            className="cta-portal"
            load={() => import("../three/CtaScene.jsx")}
            fallback={<div className="cta-portal-fallback" />}
          />
          <div className="cta-band-content">
            <h2>Pronta para reprogramar a sua relação com a comida?</h2>
            <p>
              A instabilidade fica no passado. Dê o primeiro passo hoje: fale no WhatsApp, conte seu
              objetivo e descubra como o Método Reprograme encaixa na sua rotina.
            </p>
            <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
              <Icon name="phone" size={18} />
              Agendar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
