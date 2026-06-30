export default function Strip() {
  const itens = [
    "Plano 100% personalizado",
    "Sem alimentos proibidos",
    "Acompanhamento de perto",
    "Atendimento humanizado",
  ];
  return (
    <div className="strip">
      <div className="container">
        {itens.map((t) => (
          <span key={t}>✅ {t}</span>
        ))}
      </div>
    </div>
  );
}
