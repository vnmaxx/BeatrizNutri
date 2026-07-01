import Icon from "./Icon.jsx";
import Lazy3D from "./Lazy3D.jsx";
import { whatsappLink } from "../config.js";

const inclui = [
  { icon: "target", titulo: "Plano alimentar individualizado", texto: "Montado para o seu objetivo, paladar e rotina — flexível e possível de seguir." },
  { icon: "chart", titulo: "Avaliação por bioimpedância", texto: "Acompanhamento real da composição corporal, além do número na balança." },
  { icon: "phone", titulo: "Suporte direto no WhatsApp", texto: "Acompanhamento próximo entre as consultas para ajustar e tirar dúvidas." },
  { icon: "monitor", titulo: "Presencial e online", texto: "Consultas em Moema e na Avenida Paulista, ou por vídeo de qualquer lugar." },
];

export default function Metodo() {
  return (
    <section className="section metodo" id="metodo">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Método Reprograme</span>
          <h2>Um acompanhamento de 12 semanas para reprogramar a sua relação com a comida</h2>
          <p>
            Mais do que um cardápio: um processo estruturado para emagrecer com saúde, entender o seu
            corpo e construir hábitos que se mantêm depois que o acompanhamento termina.
          </p>
        </div>
        <Lazy3D
          className="metodo-scene"
          load={() => import("../three/MetodoScene.jsx")}
          fallback={<div className="scene-fallback" />}
        />
        <div className="metodo-grid">
          {inclui.map((i) => (
            <div className="metodo-card" key={i.titulo}>
              <span className="metodo-ic">
                <Icon name={i.icon} size={24} />
              </span>
              <h3>{i.titulo}</h3>
              <p>{i.texto}</p>
            </div>
          ))}
        </div>
        <div className="center" style={{ marginTop: "40px" }}>
          <a className="btn" href={whatsappLink()} target="_blank" rel="noopener">
            Quero começar o Método Reprograme
          </a>
        </div>
      </div>
    </section>
  );
}
