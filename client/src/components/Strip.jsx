import Icon from "./Icon.jsx";

export default function Strip() {
  const itens = [
    "Plano alimentar individualizado",
    "Avaliação por bioimpedância",
    "Suporte direto no WhatsApp",
    "Sem dietas restritivas",
  ];
  return (
    <div className="strip">
      <div className="container">
        {itens.map((t) => (
          <span key={t}>
            <Icon name="check" size={18} /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}
