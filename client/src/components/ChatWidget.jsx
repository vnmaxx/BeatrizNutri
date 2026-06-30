import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
import { chatApiUrl, chatAppToken, whatsappLink } from "../config.js";

const WELCOME =
  "Olá! Sou a assistente da nutricionista Beatriz. Posso tirar dúvidas sobre o atendimento e agendar sua consulta. Como posso ajudar?";
const STORE_KEY = "bia_chat_v1";

function formatBot(s) {
  const esc = String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  return esc
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*\*/g, "")
    .replace(/(^|\n)\s*#{1,6}\s+/g, "$1")
    .replace(/(^|\n)\s*\*\s+/g, "$1• ")
    .replace(/\n/g, "<br>");
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [registered, setRegistered] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(STORE_KEY));
      if (Array.isArray(v)) setMessages(v);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      /* ignore */
    }
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open, sending]);

  async function send(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const headers = { "Content-Type": "application/json" };
      if (chatAppToken) headers["X-Bia-Token"] = chatAppToken;
      const res = await fetch(`${chatApiUrl}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.error || "Não consegui responder agora. Tente o WhatsApp." }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply || "Pode reformular?" }]);
        if (data.registered) setRegistered(true);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Estou sem conexão agora. Tente novamente ou fale no WhatsApp." },
      ]);
    } finally {
      setSending(false);
    }
  }

  const shown = messages.length ? messages : [{ role: "assistant", content: WELCOME }];

  return (
    <div className={`biachat ${open ? "open" : ""}`}>
      {open && (
        <div className="biachat-panel" role="dialog" aria-label="Assistente da Beatriz">
          <div className="biachat-head">
            <div>
              <strong>Assistente da Beatriz</strong>
              <span>Online · tira dúvidas e agenda</span>
            </div>
            <button className="biachat-x" onClick={() => setOpen(false)} aria-label="Fechar">
              &times;
            </button>
          </div>
          <div className="biachat-body" ref={bodyRef}>
            {shown.map((m, i) => (
              <div key={i} className={`biachat-msg ${m.role === "user" ? "user" : "bot"}`}>
                {m.role === "user" ? (
                  <div className="biachat-bubble">{m.content}</div>
                ) : (
                  <div className="biachat-bubble" dangerouslySetInnerHTML={{ __html: formatBot(m.content) }} />
                )}
              </div>
            ))}
            {sending && (
              <div className="biachat-msg bot">
                <div className="biachat-bubble biachat-typing">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            )}
            {registered && <div className="biachat-note">✓ Contato registrado — a Beatriz dará retorno.</div>}
          </div>
          <form className="biachat-input" onSubmit={send}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva sua mensagem…"
              maxLength={2000}
              aria-label="Mensagem"
            />
            <button type="submit" disabled={sending} aria-label="Enviar">
              <Icon name="arrow" size={18} />
            </button>
          </form>
          <a className="biachat-walink" href={whatsappLink()} target="_blank" rel="noopener">
            Prefere WhatsApp? Falar agora →
          </a>
        </div>
      )}
      {!open && (
        <button className="biachat-launch" onClick={() => setOpen(true)} aria-label="Falar com a assistente">
          <Icon name="spark" size={18} /> Tirar dúvidas
        </button>
      )}
    </div>
  );
}
