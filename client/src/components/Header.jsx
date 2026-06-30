import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { site, whatsappLink } from "../config.js";

export default function Header() {
  return (
    <header>
      <div className="container nav">
        <a href="#" className="logo">
          <span className="mark">BB</span>
          <span>
            {site.nome}
            <small>Nutricionista · CRN {site.crn}</small>
          </span>
        </a>
        <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
          <WhatsAppIcon />
          <span className="nav-cta-text">Agendar consulta</span>
        </a>
      </div>
    </header>
  );
}
