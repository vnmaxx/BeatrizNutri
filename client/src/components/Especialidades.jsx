import Icon from "./Icon.jsx";

const especialidades = [
  {
    icon: "scale",
    titulo: "Emagrecimento com saúde",
    texto: "Perca peso sem passar fome, com um plano flexível e acompanhamento de perto.",
  },
  {
    icon: "droplet",
    titulo: "Desordens endócrinas e metabólicas",
    texto: "Conduta nutricional para controle de glicemia e equilíbrio hormonal, junto ao seu médico.",
  },
  {
    icon: "heart",
    titulo: "Síndrome do Ovário Policístico (SOP)",
    texto: "Estratégia alimentar para melhorar resistência à insulina, hormônios e sintomas da SOP.",
  },
  {
    icon: "spark",
    titulo: "TPM e equilíbrio hormonal",
    texto: "Alimentação que ajuda a reduzir sintomas da TPM e dar mais estabilidade ao seu ciclo.",
  },
  {
    icon: "dumbbell",
    titulo: "Performance e hipertrofia",
    texto: "Nutrição esportiva para ganho de massa, desempenho e recuperação, alinhada ao treino.",
  },
  {
    icon: "flask",
    titulo: "Nutrição clínica funcional",
    texto: "Leitura de exames e foco na causa, não só no sintoma, com base científica.",
  },
];

export default function Especialidades() {
  return (
    <section className="section" id="especialidades" style={{ background: "var(--verde-claro)" }}>
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Áreas de atuação</span>
          <h2>Especialidades clínicas e esportivas</h2>
          <p>
            Atendimento individual para cada objetivo, com base em endocrinologia, metabologia e
            nutrição clínica funcional.
          </p>
        </div>
        <div className="serv-grid">
          {especialidades.map((s) => (
            <div className="card" key={s.titulo}>
              <span className="ic">
                <Icon name={s.icon} size={26} />
              </span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
