import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { whatsappLink } from "../config.js";

export default function CtaBand() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band">
          <h2>Pronta para começar a cuidar de você?</h2>
          <p>
            Dê o primeiro passo hoje. Me chame no WhatsApp, conte seu objetivo e descubra como o
            acompanhamento pode encaixar na sua rotina.
          </p>
          <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
            <WhatsAppIcon />
            Agendar pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
