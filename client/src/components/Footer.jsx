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
              {site.titulo}. Acompanhamento individual, com base clínica, em São Paulo e online.
            </p>
            {site.crn && <p>{site.crn}</p>}
          </div>
          <div>
            <h4>Atendimento</h4>
            <a href="#metodo">Método Reprograme</a>
            <a href="#especialidades">Emagrecimento</a>
            <a href="#especialidades">SOP e hormonal</a>
            <a href="#especialidades">Performance e hipertrofia</a>
          </div>
          <div>
            <h4>Contato</h4>
            <a href={whatsappLink()} target="_blank" rel="noopener">
              WhatsApp: {site.telefoneExibicao}
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.instagram && (
              <a href={site.instagram} target="_blank" rel="noopener">
                {site.instagramHandle}
              </a>
            )}
            <a href={site.siteUrl} target="_blank" rel="noopener">
              {site.siteUrl.replace("https://", "")}
            </a>
            <p>{site.endereco}</p>
          </div>
        </div>
        <div className="foot-bottom">
          © 2026 {site.nome} · {site.titulo}. Todos os direitos reservados.
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
