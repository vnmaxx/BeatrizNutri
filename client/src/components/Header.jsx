import Icon from "./Icon.jsx";
import { site, whatsappLink } from "../config.js";

export default function Header() {
  return (
    <header>
      <div className="container nav">
        <a href="#" className="logo">
          <span className="mark">BB</span>
          <span>
            {site.nome}
            <small>{site.titulo}{site.crn ? ` · ${site.crn}` : ""}</small>
          </span>
        </a>
        <nav className="nav-links">
          <a href="#metodo">Método</a>
          <a href="#especialidades">Especialidades</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
        <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
          <Icon name="phone" size={18} />
          <span className="nav-cta-text">Agendar avaliação</span>
        </a>
      </div>
    </header>
  );
}
