import { site } from "../config.js";

const depoimentos = [
  {
    texto:
      "[TROCAR: depoimento real de paciente — ex.: como foi o atendimento, o resultado e o que mais gostou.]",
    nome: "[TROCAR: nome]",
    info: "[TROCAR: objetivo / cidade]",
  },
  {
    texto: "[TROCAR: depoimento real de paciente — mantenha autêntico, com permissão de uso.]",
    nome: "[TROCAR: nome]",
    info: "[TROCAR: objetivo / cidade]",
  },
  {
    texto: "[TROCAR: depoimento real de paciente — pode ser um print do Doctoralia transcrito.]",
    nome: "[TROCAR: nome]",
    info: "[TROCAR: objetivo / cidade]",
  },
];

export default function Depoimentos() {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Resultados de quem confiou</span>
          <h2>O que os pacientes dizem</h2>
          <p>
            [TROCAR: substitua pelos depoimentos reais — pode usar avaliações verificadas do seu
            perfil no Doctoralia.]
          </p>
        </div>
        <div className="depo-grid">
          {depoimentos.map((d, i) => (
            <div className="depo" key={i}>
              <div className="stars">★★★★★</div>
              <p>"{d.texto}"</p>
              <div className="pessoa">
                <span className="av">??</span>
                <div>
                  <b>{d.nome}</b>
                  <span>{d.info}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="nota-placeholder">
          ⭐ Veja minhas avaliações verificadas no Doctoralia →{" "}
          <a href={site.doctoralia} target="_blank" rel="noopener">
            [TROCAR: link do seu perfil no Doctoralia]
          </a>
        </p>
      </div>
    </section>
  );
}
