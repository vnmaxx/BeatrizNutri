const servicos = [
  {
    ic: "⚖️",
    titulo: "Emagrecimento saudável",
    texto:
      "Perca peso sem passar fome, com um cardápio flexível adaptado ao seu paladar e à sua rotina.",
    itens: ["Sem alimentos proibidos", "Metas realistas e mensuráveis", "Ajustes a cada retorno"],
  },
  {
    ic: "🥗",
    titulo: "Reeducação alimentar",
    texto:
      "Construa uma relação leve e sustentável com a comida para resultados que se mantêm de verdade.",
    itens: ["Hábitos no seu ritmo", "Educação nutricional prática", "Sem terrorismo alimentar"],
  },
  {
    ic: "💪",
    titulo: "Nutrição esportiva",
    texto:
      "Alimentação alinhada ao seu treino para mais desempenho, recuperação e composição corporal.",
    itens: ["Estratégia pré e pós-treino", "Foco em massa e energia", "Suplementação quando necessária"],
  },
  {
    ic: "🩺",
    titulo: "Saúde e exames",
    texto:
      "Apoio nutricional para colesterol, glicemia, intestino e bem-estar geral, em parceria com seu acompanhamento médico.",
    itens: ["Leitura de exames", "Conduta baseada em ciência", "Foco na causa, não só no sintoma"],
  },
  {
    ic: "🌱",
    titulo: "Alimentação no dia a dia",
    texto:
      "Para quem quer comer melhor sem virar a vida de cabeça pra baixo — praticidade em primeiro lugar.",
    itens: ["Lista de compras inteligente", "Refeições rápidas", "Opções para comer fora"],
  },
  {
    ic: "💻",
    titulo: "Consulta online",
    texto:
      "Mesmo cuidado da consulta presencial, por vídeo, de onde você estiver — prático e seguro.",
    itens: ["Atendimento por vídeo", "Material enviado por digital", "Suporte entre consultas"],
  },
];

export default function Servicos() {
  return (
    <section className="section" id="servicos" style={{ background: "var(--verde-claro)" }}>
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Como posso te ajudar</span>
          <h2>Atendimentos para cada objetivo</h2>
          <p>
            Escolha o acompanhamento ideal para o seu momento. Tudo individual, presencial em São
            Paulo ou online de qualquer lugar.
          </p>
        </div>
        <div className="serv-grid">
          {servicos.map((s) => (
            <div className="card" key={s.titulo}>
              <span className="ic">{s.ic}</span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
              <ul>
                {s.itens.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
