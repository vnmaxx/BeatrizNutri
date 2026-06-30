const depoimentos = [
  {
    texto:
      "Aprendi a organizar minhas refeições e, mais do que emagrecer, voltei a gostar de mim mesma.",
    nome: "Ana S.",
    info: "Reeducação alimentar",
  },
  {
    texto:
      "Pela primeira vez sinto liberdade para comer, sem culpa, e continuo eliminando peso.",
    nome: "Paula M.",
    info: "Emagrecimento",
  },
  {
    texto:
      "Ela entendeu minha rotina de mãe e me mostrou que dá para emagrecer sem abrir mão de momentos com minha filha.",
    nome: "Mariana R.",
    info: "Emagrecimento com saúde",
  },
];

export default function Depoimentos() {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Resultados de quem confiou</span>
          <h2>O que as pacientes dizem</h2>
          <p>Histórias reais de quem encontrou um método que cabe na vida.</p>
        </div>
        <div className="depo-grid">
          {depoimentos.map((d, i) => (
            <div className="depo" key={i}>
              <div className="stars" aria-label="5 de 5">
                ★★★★★
              </div>
              <p>{d.texto}</p>
              <div className="pessoa">
                <span className="av">{d.nome.charAt(0)}</span>
                <div>
                  <b>{d.nome}</b>
                  <span>{d.info}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
