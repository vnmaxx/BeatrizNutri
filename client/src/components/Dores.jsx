import Icon from "./Icon.jsx";

const dores = [
  {
    icon: "activity",
    titulo: "Efeito sanfona",
    texto: "Você emagrece, recupera tudo e se frustra com dietas que ninguém consegue manter.",
  },
  {
    icon: "droplet",
    titulo: "Questões hormonais e metabólicas",
    texto: "SOP, TPM, glicemia ou tireoide influenciam seu peso e pouca gente leva isso em conta.",
  },
  {
    icon: "spark",
    titulo: "Informação demais",
    texto: "Cada post fala uma coisa e você não sabe mais o que de fato funciona para o seu corpo.",
  },
  {
    icon: "clock",
    titulo: "Rotina corrida",
    texto: "Trabalho, casa e pouco tempo — e nenhum plano genérico considera a sua realidade.",
  },
];

export default function Dores() {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Se você se identifica</span>
          <h2>Já tentou de tudo e nada se manteve a longo prazo?</h2>
          <p>
            O problema não é falta de força de vontade. É falta de um método que respeite o seu
            corpo, a sua rotina e o que o seu metabolismo realmente precisa.
          </p>
        </div>
        <div className="dores-grid">
          {dores.map((d) => (
            <div className="dor" key={d.titulo}>
              <span className="ic">
                <Icon name={d.icon} size={22} />
              </span>
              <div>
                <h3>{d.titulo}</h3>
                <p>{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
