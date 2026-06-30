import { whatsappLink } from "../config.js";

const passos = [
  {
    n: 1,
    titulo: "Primeiro contato",
    texto: "Você chama no WhatsApp e conta seu objetivo. A Beatriz tira suas dúvidas e agenda.",
  },
  {
    n: 2,
    titulo: "Avaliação completa",
    texto: "Anamnese detalhada, bioimpedância, histórico, exames e preferências alimentares.",
  },
  {
    n: 3,
    titulo: "Seu plano individualizado",
    texto: "Você recebe um plano feito para o seu corpo e a sua rotina — flexível e possível.",
  },
  {
    n: 4,
    titulo: "Acompanhamento de 12 semanas",
    texto: "Retornos e suporte no WhatsApp para ajustar, evoluir e manter os resultados.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Simples e sem complicação</span>
          <h2>Como funciona o acompanhamento</h2>
        </div>
        <div className="passos">
          {passos.map((p) => (
            <div className="passo" key={p.n}>
              <div className="num">{p.n}</div>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
        <div className="center" style={{ marginTop: "40px" }}>
          <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
            Quero começar agora
          </a>
        </div>
      </div>
    </section>
  );
}
