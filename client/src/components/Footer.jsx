import { site, whatsappLink } from "../config.js";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="foot-logo">
              <span className="logo">
                <span className="mark" style={{ display: "inline-flex" }}>
                  BB
                </span>
              </span>{" "}
              {site.nome}
            </div>
            <p>
              Nutricionista em São Paulo e atendimento online. Acompanhamento individual, humano e
              baseado em ciência.
            </p>
            <p>CRN {site.crn}</p>
          </div>
          <div>
            <h4>Atendimento</h4>
            <a href="#servicos">Emagrecimento</a>
            <a href="#servicos">Reeducação alimentar</a>
            <a href="#servicos">Nutrição esportiva</a>
            <a href="#servicos">Consulta online</a>
          </div>
          <div>
            <h4>Contato</h4>
            <a href={whatsappLink()} target="_blank" rel="noopener">
              WhatsApp: {site.telefoneExibicao}
            </a>
            <a href={site.instagram} target="_blank" rel="noopener">
              {site.instagramHandle}
            </a>
            <a href={site.siteUrl} target="_blank" rel="noopener">
              {site.siteUrl.replace("https://", "")}
            </a>
            <a href={site.doctoralia} target="_blank" rel="noopener">
              [TROCAR: link do Doctoralia]
            </a>
            <p>{site.endereco}</p>
          </div>
        </div>
        <div className="foot-bottom">
          © 2026 {site.nome} · Nutricionista. Todos os direitos reservados.
          <p className="disc">
            As informações deste site têm caráter informativo e não substituem uma consulta.
            Resultados variam de pessoa para pessoa. O acompanhamento nutricional é individualizado e
            definido em consulta.
          </p>
        </div>
      </div>
    </footer>
  );
}
