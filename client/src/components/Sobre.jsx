import { site, whatsappLink } from "../config.js";

export default function Sobre() {
  return (
    <section className="section sobre" id="sobre">
      <div className="container sobre-grid">
        <div className="sobre-img">[Foto da Beatriz no consultório — formato quadrado]</div>
        <div>
          <span className="eyebrow">Quem vai te atender</span>
          <h2>Beatriz Batista, nutricionista clínica e esportiva</h2>
          <p>
            Pós-graduada em Endocrinologia, Metabologia e Nutrição Clínica Funcional, a Beatriz já
            realizou mais de 3.000 atendimentos. Seu trabalho une base científica e olhar individual
            para cada paciente — nada de cardápio genérico ou dieta impossível de manter.
          </p>
          <p>
            O foco é entender o seu metabolismo, seus hormônios e a sua rotina para construir um
            plano que traga resultado e, principalmente, se mantenha. Atende em Moema e na Avenida
            Paulista, em São Paulo, e online para todo o Brasil.
          </p>
          <div className="stats">
            <div>
              <b>3.000+</b>
              <span>atendimentos realizados</span>
            </div>
            <div>
              <b>Pós</b>
              <span>Endocrinologia e Metabologia</span>
            </div>
            <div>
              <b>SP</b>
              <span>Moema, Paulista e online</span>
            </div>
          </div>
          <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
            Agendar minha avaliação
          </a>
          {site.crn && (
            <p style={{ marginTop: "14px", fontSize: ".85rem", color: "var(--cinza)" }}>{site.crn}</p>
          )}
        </div>
      </div>
    </section>
  );
}
