const faqs = [
  {
    aberto: true,
    pergunta: "Como funciona o Método Reprograme?",
    resposta:
      "É um acompanhamento de 12 semanas com plano alimentar individualizado, avaliação por bioimpedância e suporte direto no WhatsApp. O foco é emagrecer com saúde e construir hábitos que se mantêm depois que o acompanhamento termina. As consultas podem ser presenciais (Moema ou Avenida Paulista) ou online.",
  },
  {
    pergunta: "Vou ter que cortar tudo que gosto de comer?",
    resposta:
      "Não. O trabalho é o oposto de dietas radicais. Construímos um plano flexível, que respeita seu paladar e sua rotina, para que você consiga manter os resultados a longo prazo, sem alimentos proibidos.",
  },
  {
    pergunta: "A Beatriz atende casos hormonais, como SOP e TPM?",
    resposta:
      "Sim. Com pós-graduação em Endocrinologia, Metabologia e Nutrição Clínica Funcional, a Beatriz trabalha com desordens endócrinas e metabólicas, controle de glicemia, equilíbrio hormonal, Síndrome do Ovário Policístico (SOP) e TPM, sempre em parceria com o seu médico.",
  },
  {
    pergunta: "Como é a consulta online?",
    resposta:
      "A consulta online é por vídeo, com a mesma atenção e profundidade da presencial. Você recebe o plano e os materiais de forma digital e conta com suporte entre as consultas. Ideal para quem não está em São Paulo ou tem a rotina corrida.",
  },
  {
    pergunta: "Em quanto tempo vejo resultados?",
    resposta:
      "Cada corpo responde no seu tempo, por isso não fazemos promessas mágicas. O foco é em mudanças consistentes e saudáveis. Com acompanhamento de perto e ajustes constantes, a maioria das pessoas percebe melhora na disposição e nos hábitos já nas primeiras semanas.",
  },
  {
    pergunta: "Preciso levar exames na primeira consulta?",
    resposta:
      "Se você tiver exames recentes, traga — eles ajudam muito na avaliação. Se não tiver, começamos com a avaliação completa e a Beatriz orienta quais exames podem ajudar no seu acompanhamento.",
  },
];

export default function Faq() {
  return (
    <section className="section" style={{ background: "var(--verde-claro)" }}>
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Perguntas frequentes</span>
          <h2>Tirando suas dúvidas</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={i} open={f.aberto}>
              <summary>{f.pergunta}</summary>
              <div className="ans">{f.resposta}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
