const dores = [
  {
    ic: "🔁",
    titulo: "Efeito sanfona",
    texto: "Emagrece, recupera tudo e fica frustrada com dietas que ninguém consegue manter.",
  },
  {
    ic: "😴",
    titulo: "Cansaço e falta de energia",
    texto: "Come no automático, pula refeições e sente o corpo sempre no limite.",
  },
  {
    ic: "🤯",
    titulo: "Informação demais",
    texto: "Cada post fala uma coisa e você não sabe mais o que de fato funciona pra você.",
  },
  {
    ic: "⏰",
    titulo: "Rotina corrida",
    texto: "Trabalho, casa e pouco tempo para cozinhar — e nenhuma dieta considera isso.",
  },
];

export default function Dores() {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Se você se identifica…</span>
          <h2>Já tentou de tudo e nada se manteve a longo prazo?</h2>
          <p>
            Você não precisa de mais uma dieta restritiva. Precisa de um plano que caiba na sua vida.
          </p>
        </div>
        <div className="dores-grid">
          {dores.map((d) => (
            <div className="dor" key={d.titulo}>
              <span className="ic">{d.ic}</span>
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
