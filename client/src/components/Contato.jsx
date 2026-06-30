import { useState } from "react";
import Icon from "./Icon.jsx";
import { site, whatsappLink } from "../config.js";

const estadoInicial = { nome: "", telefone: "", objetivo: "", mensagem: "" };

const objetivos = [
  "Emagrecimento com saúde",
  "Síndrome do Ovário Policístico (SOP)",
  "TPM e equilíbrio hormonal",
  "Glicemia e questões metabólicas",
  "Performance e hipertrofia",
  "Consulta online",
  "Outro",
];

export default function Contato() {
  const [form, setForm] = useState(estadoInicial);
  const [status, setStatus] = useState({ tipo: null, msg: "" });
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ tipo: null, msg: "" });
    if (!form.nome.trim() || !form.telefone.trim()) {
      setStatus({ tipo: "err", msg: "Por favor, preencha nome e telefone." });
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus({
          tipo: "ok",
          msg: "Recebido. Em breve a Beatriz entra em contato. Se preferir, fale agora no WhatsApp.",
        });
        setForm(estadoInicial);
      } else {
        setStatus({ tipo: "err", msg: data.error || "Não foi possível enviar. Tente novamente." });
      }
    } catch {
      setStatus({ tipo: "err", msg: "Erro de conexão. Tente novamente ou fale direto no WhatsApp." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="section" id="contato">
      <div className="container">
        <div className="sec-head">
          <span className="eyebrow">Vamos conversar</span>
          <h2>Deixe seu contato</h2>
          <p>Preencha o formulário que a Beatriz retorna para você — ou chame direto no WhatsApp.</p>
        </div>
        <div className="contato-grid">
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">WhatsApp / Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="objetivo">Seu objetivo</label>
              <select id="objetivo" name="objetivo" value={form.objetivo} onChange={handleChange}>
                <option value="">Selecione</option>
                {objetivos.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={form.mensagem}
                onChange={handleChange}
                placeholder="Conte um pouco sobre o que você procura"
              />
            </div>
            <button className="btn" type="submit" disabled={enviando} style={{ width: "100%" }}>
              {enviando ? "Enviando..." : "Enviar contato"}
            </button>
            {status.tipo && <div className={`form-msg ${status.tipo}`}>{status.msg}</div>}
          </form>

          <div className="contato-info">
            <h3>Prefere falar agora?</h3>
            <p>
              O atendimento é individual e humano. Chame no WhatsApp, conte seu objetivo e a Beatriz
              explica como o acompanhamento encaixa na sua rotina.
            </p>
            <ul className="contato-list">
              <li>
                <Icon name="phone" size={18} /> {site.telefoneExibicao}
              </li>
              <li>
                <Icon name="mail" size={18} /> {site.email}
              </li>
              <li>
                <Icon name="pin" size={18} /> {site.endereco}
              </li>
              <li>
                <Icon name="monitor" size={18} /> Consultas online para todo o Brasil
              </li>
            </ul>
            <a className="btn" href={whatsappLink()} target="_blank" rel="noopener" style={{ marginTop: "10px" }}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
