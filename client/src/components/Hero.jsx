import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { whatsappLink } from "../config.js";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">São Paulo · Presencial e Online</span>
          <h1>
            Emagreça com saúde e <span>sem dietas malucas</span> — com um plano feito pra sua rotina
          </h1>
          <p className="sub">
            Acompanhamento nutricional individual para você comer melhor, ter mais energia e atingir
            seu objetivo de forma realista e duradoura. Atendimento humano, baseado em ciência.
          </p>
          <div className="hero-actions">
            <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
              <WhatsAppIcon />
              Falar no WhatsApp
            </a>
            <a className="btn btn-outline" href="#servicos">
              Ver como funciona
            </a>
          </div>
          <div className="hero-trust">
            <span>
              ⭐ <b>3.000+</b> consultas realizadas
            </span>
            <span>
              📅 Atuando desde <b>2017</b>
            </span>
            <span>
              💻 Presencial e <b>online</b>
            </span>
          </div>
        </div>
        <div className="hero-img">
          [TROCAR: foto profissional da Beatriz Batista — sorrindo, fundo claro, vertical 4:5]
          <div className="badge-float">
            <span className="ic">🩺</span>
            <span>
              <b>Nutricionista verificada</b>
              <br />
              Perfil no Doctoralia · São Paulo e online
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
