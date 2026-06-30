import { site, whatsappLink } from "../config.js";

export default function Sobre() {
  return (
    <section className="section sobre">
      <div className="container sobre-grid">
        <div className="sobre-img">
          [TROCAR: foto da Beatriz no consultório ou atendendo — formato quadrado]
        </div>
        <div>
          <span className="eyebrow">Quem vai te atender</span>
          <h2>Olá, eu sou a Beatriz Batista</h2>
          <p>
            Sou nutricionista e atendo em São Paulo e online desde 2017. Nesse tempo, já realizei
            mais de 3.000 consultas ajudando pessoas a emagrecer, melhorar a saúde e se reconciliar
            com a comida — sem dietas impossíveis de manter.
          </p>
          <p>
            Acredito em um trabalho próximo, humano e individual: nada de cardápio genérico. Cada
            plano nasce da sua rotina, do seu paladar e do seu objetivo, para que o resultado venha
            e, principalmente, se mantenha.
          </p>
          <div className="stats">
            <div>
              <b>3.000+</b>
              <span>consultas realizadas</span>
            </div>
            <div>
              <b>2017</b>
              <span>atuando na área</span>
            </div>
            <div>
              <b>SP</b>
              <span>+ online no Brasil todo</span>
            </div>
          </div>
          <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
            Agendar minha consulta
          </a>
          <p style={{ marginTop: "14px", fontSize: ".85rem", color: "var(--cinza)" }}>
            CRN {site.crn} · [TROCAR: pós-graduações / especializações reais]
          </p>
        </div>
      </div>
    </section>
  );
}
