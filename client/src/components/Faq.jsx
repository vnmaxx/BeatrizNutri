const faqs = [
  {
    aberto: true,
    pergunta: "Como funciona a consulta online?",
    resposta:
      "A consulta online é por chamada de vídeo, com a mesma atenção e profundidade da presencial. Você recebe seu plano e materiais de forma digital e conta com suporte entre as consultas. Ideal para quem não está em São Paulo ou tem a rotina corrida.",
  },
  {
    pergunta: "Vou ter que cortar tudo que gosto de comer?",
    resposta:
      "Não. Meu trabalho é justamente o contrário de dietas radicais. Construímos um plano flexível, que respeita seu paladar e sua rotina, para que você consiga manter os resultados a longo prazo — sem alimentos proibidos.",
  },
  {
    pergunta: "Quanto custa a consulta?",
    resposta:
      "Os valores e formatos de acompanhamento variam conforme o seu objetivo. Me chame no WhatsApp que eu te explico tudo direitinho e indico a melhor opção para o seu caso. [TROCAR: incluir valores ou pacotes, se desejar exibir aqui.]",
  },
  {
    pergunta: "Em quanto tempo vejo resultados?",
    resposta:
      "Cada corpo responde no seu tempo, e por isso fujo de promessas mágicas. O foco é em mudanças consistentes e saudáveis. Com acompanhamento de perto e ajustes constantes, a maioria das pessoas percebe melhora na disposição e nos hábitos já nas primeiras semanas.",
  },
  {
    pergunta: "Você atende casos específicos de saúde?",
    resposta:
      "Sim. Trabalho com objetivos como emagrecimento, reeducação alimentar, nutrição esportiva e apoio em exames alterados (colesterol, glicemia, intestino, entre outros), sempre em parceria com o acompanhamento do seu médico. Conte seu caso no WhatsApp para eu avaliar.",
  },
  {
    pergunta: "Preciso levar exames na primeira consulta?",
    resposta:
      "Se você tiver exames recentes, traga — eles ajudam muito na avaliação. Mas não se preocupe se não tiver: começamos com a avaliação completa e oriento quais exames podem ajudar no seu acompanhamento.",
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
