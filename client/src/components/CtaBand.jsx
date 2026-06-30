import Icon from "./Icon.jsx";
import { whatsappLink } from "../config.js";

export default function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band">
          <h2>Pronta para reprogramar a sua relação com a comida?</h2>
          <p>
            Dê o primeiro passo hoje. Fale no WhatsApp, conte seu objetivo e descubra como o
            acompanhamento encaixa na sua rotina.
          </p>
          <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
            <Icon name="phone" size={18} />
            Agendar pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
