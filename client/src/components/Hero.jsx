import Icon from "./Icon.jsx";
import { whatsappLink } from "../config.js";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Moema e Avenida Paulista · Presencial e Online</span>
          <h1>
            Para quem já tentou de tudo e quer um <span>método eficiente</span> de emagrecimento
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
        <div className="hero-img">
          [Foto profissional da Beatriz Batista — vertical 4:5, fundo claro]
          <div className="badge-float">
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
    </section>
  );
}
