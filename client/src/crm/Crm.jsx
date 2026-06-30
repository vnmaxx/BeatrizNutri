import { useEffect, useMemo, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";
import {
  isAllowed,
  getLeads,
  updateLeadStage,
  updateLeadFields,
  addLeadEvent,
  setAgendamento,
  deleteLead,
} from "./data.js";

// Funil de nutrição.
const STAGES = [
  { key: "NOVO", label: "Novo", color: "#9b5cff" },
  { key: "CONTATADO", label: "Em conversa", color: "#2f7bff" },
  { key: "AGENDADO", label: "Consulta agendada", color: "#f5b73c" },
  { key: "CONSULTA", label: "Consulta realizada", color: "#22d3ee" },
  { key: "ATIVO", label: "Paciente ativo", color: "#36d399" },
  { key: "PERDIDO", label: "Não evoluiu", color: "#ff4d4f" },
];
const STAGE_KEYS = STAGES.map((s) => s.key);
const stageOf = (k) => STAGES.find((s) => s.key === k) || STAGES[0];
const leadStage = (l) => (l && STAGE_KEYS.includes(l.stage) ? l.stage : "NOVO");

const CANAIS = { whatsapp: "WhatsApp", email: "E-mail", site: "Site" };
const ORIGEM = { form: "Formulário", chat: "Chat IA", whatsapp: "WhatsApp" };

const tsMs = (ts) =>
  ts && typeof ts.toDate === "function"
    ? ts.toDate().getTime()
    : ts && ts.seconds
      ? ts.seconds * 1000
      : typeof ts === "number"
        ? ts
        : 0;

function fmtDate(ts) {
  const ms = tsMs(ts);
  if (!ms) return "—";
  const d = new Date(ms);
  return (
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function Crm() {
  const [user, setUser] = useState(undefined); // undefined = carregando
  const [allowed, setAllowed] = useState(null);
  const [erroLogin, setErroLogin] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        try {
          setAllowed(await isAllowed(u.uid));
        } catch {
          setAllowed(false);
        }
      } else {
        setAllowed(null);
      }
    });
  }, []);

  async function entrar() {
    setErroLogin("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setErroLogin(e.message || "Falha no login.");
    }
  }

  if (user === undefined) {
    return (
      <div className="crm-shell crm-center">
        <span className="crm-spinner" /> Carregando…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="crm-shell crm-center">
        <div className="crm-login">
          <div className="crm-login-mark">BB</div>
          <h1>CRM · Beatriz Batista</h1>
          <p>Acesso restrito à equipe. Entre com sua conta Google autorizada.</p>
          <button className="btn" onClick={entrar}>
            Entrar com Google
          </button>
          {erroLogin && <p className="crm-err">{erroLogin}</p>}
        </div>
      </div>
    );
  }

  if (allowed === null) {
    return (
      <div className="crm-shell crm-center">
        <span className="crm-spinner" /> Verificando acesso…
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="crm-shell crm-center">
        <div className="crm-login">
          <div className="crm-login-mark" style={{ background: "#ff4d4f" }}>
            !
          </div>
          <h1>Acesso não autorizado</h1>
          <p>
            A conta <b>{user.email}</b> não está na allowlist do CRM. Peça para um administrador
            adicionar seu UID:
          </p>
          <code className="crm-uid">{user.uid}</code>
          <button className="btn btn-outline" onClick={() => signOut(auth)}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  return <Board user={user} />;
}

function Board({ user }) {
  const [leads, setLeads] = useState(null);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [fOrigem, setFOrigem] = useState("todos");
  const [fCanal, setFCanal] = useState("todos");
  const [openId, setOpenId] = useState(null);
  const [dragId, setDragId] = useState(null);

  async function carregar() {
    setErro("");
    try {
      setLeads(await getLeads());
    } catch (e) {
      setErro(e.message || "Falha ao carregar leads.");
      setLeads([]);
    }
  }
  useEffect(() => {
    carregar();
  }, []);

  const visiveis = useMemo(() => {
    if (!leads) return [];
    const q = busca.trim().toLowerCase();
    return leads.filter((l) => {
      if (fOrigem !== "todos" && (l.origem || "chat") !== fOrigem) return false;
      if (fCanal !== "todos" && (l.canal || "") !== fCanal) return false;
      if (!q) return true;
      return [l.nome, l.contato, l.email, l.whatsapp, l.objetivo, l.assunto, l.mensagem].some((v) =>
        (v || "").toLowerCase().includes(q)
      );
    });
  }, [leads, busca, fOrigem, fCanal]);

  const metrics = useMemo(() => {
    const t = leads || [];
    const total = t.length;
    const agendados = t.filter((l) => leadStage(l) === "AGENDADO").length;
    const ativos = t.filter((l) => leadStage(l) === "ATIVO").length;
    const semana = Date.now() - 7 * 86400000;
    const novos = t.filter((l) => tsMs(l.createdAt) >= semana).length;
    const conv = total ? Math.round((ativos / total) * 100) : 0;
    return [
      { v: total, l: "Total de leads" },
      { v: agendados, l: "Agendados" },
      { v: ativos, l: "Pacientes ativos" },
      { v: conv + "%", l: "Conversão" },
      { v: novos, l: "Novos (7 dias)" },
    ];
  }, [leads]);

  async function mover(id, stage) {
    const lead = leads.find((l) => l.id === id);
    if (!lead || leadStage(lead) === stage) return;
    const prev = lead.stage;
    setLeads((arr) => arr.map((l) => (l.id === id ? { ...l, stage } : l)));
    try {
      await updateLeadStage(id, stage);
    } catch (e) {
      setLeads((arr) => arr.map((l) => (l.id === id ? { ...l, stage: prev } : l)));
      alert("Não foi possível mover: " + e.message);
    }
  }

  const openLead = leads?.find((l) => l.id === openId) || null;

  return (
    <div className="crm-shell">
      <header className="crm-top">
        <div className="crm-top-brand">
          <span className="crm-login-mark sm">BB</span>
          <strong>CRM · Beatriz Batista</strong>
        </div>
        <div className="crm-top-user">
          <span>{user.email}</span>
          <button className="btn btn-outline sm" onClick={() => signOut(auth)}>
            Sair
          </button>
        </div>
      </header>

      <main className="crm-main">
        <div className="crm-metrics">
          {metrics.map((m) => (
            <div className="crm-metric" key={m.l}>
              <div className="v">{m.v}</div>
              <div className="l">{m.l}</div>
            </div>
          ))}
        </div>

        <div className="crm-bar">
          <input
            className="crm-search"
            type="search"
            placeholder="Buscar nome, contato, objetivo…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select value={fOrigem} onChange={(e) => setFOrigem(e.target.value)}>
            <option value="todos">Todas as origens</option>
            <option value="form">Formulário</option>
            <option value="chat">Chat IA</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <select value={fCanal} onChange={(e) => setFCanal(e.target.value)}>
            <option value="todos">Todos os canais</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">E-mail</option>
            <option value="site">Site</option>
          </select>
          <button className="btn btn-outline sm" onClick={carregar}>
            Atualizar
          </button>
        </div>

        {erro && <p className="crm-err">{erro}</p>}
        {leads === null && (
          <p className="crm-dim">
            <span className="crm-spinner" /> Carregando leads…
          </p>
        )}
        {leads && leads.length === 0 && !erro && (
          <p className="crm-dim">
            Nenhum lead ainda. Eles aparecem aqui quando alguém usa o formulário, o chat de IA ou o
            WhatsApp.
          </p>
        )}

        <div className="crm-board">
          {STAGES.map((s) => {
            const items = visiveis
              .filter((l) => leadStage(l) === s.key)
              .sort((a, b) => tsMs(b.updatedAt || b.createdAt) - tsMs(a.updatedAt || a.createdAt));
            return (
              <div
                key={s.key}
                className="crm-col"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("drop");
                }}
                onDragLeave={(e) => e.currentTarget.classList.remove("drop")}
                onDrop={(e) => {
                  e.currentTarget.classList.remove("drop");
                  if (dragId) mover(dragId, s.key);
                }}
              >
                <div className="crm-col-head">
                  <span className="crm-dot" style={{ background: s.color }} />
                  {s.label}
                  <span className="crm-count">{items.length}</span>
                </div>
                <div className="crm-col-body">
                  {items.map((l) => (
                    <div
                      key={l.id}
                      className="crm-card"
                      draggable
                      onDragStart={() => setDragId(l.id)}
                      onDragEnd={() => setDragId(null)}
                      onClick={() => setOpenId(l.id)}
                    >
                      <div className="crm-card-top">
                        <strong>{l.nome || "—"}</strong>
                        {l.canal && <span className="crm-canal">{CANAIS[l.canal] || l.canal}</span>}
                      </div>
                      <div className="crm-card-meta">
                        <span className={`crm-origem ${l.origem || "chat"}`}>
                          {ORIGEM[l.origem] || "Chat IA"}
                        </span>
                        {l.objetivo && <span className="crm-seg">{l.objetivo}</span>}
                      </div>
                      <div className="crm-card-contato">{l.contato || l.email || l.whatsapp || ""}</div>
                      {l.agendamento?.preferencia || l.agendamento?.dataHora ? (
                        <div className="crm-card-agenda">
                          Agenda: {l.agendamento.dataHora || l.agendamento.preferencia}
                          {l.modalidade ? ` · ${l.modalidade}` : ""}
                        </div>
                      ) : null}
                      <div className="crm-card-date">{fmtDate(l.updatedAt || l.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {openLead && (
        <Drawer
          lead={openLead}
          onClose={() => setOpenId(null)}
          onChange={(patch) => setLeads((arr) => arr.map((l) => (l.id === openLead.id ? { ...l, ...patch } : l)))}
          onDelete={() => {
            setLeads((arr) => arr.filter((l) => l.id !== openLead.id));
            setOpenId(null);
          }}
          onMove={mover}
        />
      )}
    </div>
  );
}

function Drawer({ lead, onClose, onChange, onDelete, onMove }) {
  const [obs, setObs] = useState(lead.observacao || "");
  const [nota, setNota] = useState("");
  const [dataHora, setDataHora] = useState(lead.agendamento?.dataHora || "");
  const [modalidade, setModalidade] = useState(lead.modalidade || lead.agendamento?.modalidade || "");
  const eventos = [...(lead.historico || [])].sort((a, b) => (b.em || 0) - (a.em || 0));

  async function salvarDados() {
    try {
      await updateLeadFields(lead.id, { observacao: obs });
      onChange({ observacao: obs });
    } catch (e) {
      alert("Falha ao salvar: " + e.message);
    }
  }
  async function addNota() {
    if (!nota.trim()) return;
    try {
      await addLeadEvent(lead.id, "nota", nota.trim());
      onChange({ historico: [...(lead.historico || []), { tipo: "nota", texto: nota.trim(), em: Date.now() }] });
      setNota("");
    } catch (e) {
      alert("Falha ao salvar nota: " + e.message);
    }
  }
  async function marcarConsulta() {
    const ag = {
      status: "marcado",
      modalidade: modalidade || "",
      dataHora: dataHora || "",
      preferencia: lead.agendamento?.preferencia || "",
    };
    try {
      await setAgendamento(lead.id, ag);
      onChange({ agendamento: ag, modalidade, stage: "AGENDADO" });
    } catch (e) {
      alert("Falha ao agendar: " + e.message);
    }
  }
  async function excluir() {
    if (!confirm("Excluir este lead definitivamente?")) return;
    try {
      await deleteLead(lead.id);
      onDelete();
    } catch (e) {
      alert("Falha ao excluir: " + e.message);
    }
  }

  return (
    <div className="crm-drawer" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="crm-drawer-inner">
        <button className="crm-drawer-x" onClick={onClose} aria-label="Fechar">
          &times;
        </button>
        <h3>{lead.nome || "—"}</h3>
        <div className="crm-chips">
          {STAGES.map((s) => (
            <button
              key={s.key}
              className={`crm-chip ${leadStage(lead) === s.key ? "on" : ""}`}
              style={{ "--cc": s.color }}
              onClick={() => onMove(lead.id, s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <dl className="crm-fields">
          {lead.contato && (
            <>
              <dt>Contato</dt>
              <dd>{lead.contato}</dd>
            </>
          )}
          {lead.email && (
            <>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </dd>
            </>
          )}
          {lead.whatsapp && (
            <>
              <dt>WhatsApp</dt>
              <dd>
                <a href={`https://wa.me/${(lead.whatsapp || "").replace(/\D/g, "")}`} target="_blank" rel="noopener">
                  {lead.whatsapp}
                </a>
              </dd>
            </>
          )}
          {lead.objetivo && (
            <>
              <dt>Objetivo</dt>
              <dd>{lead.objetivo}</dd>
            </>
          )}
          <dt>Origem</dt>
          <dd>{ORIGEM[lead.origem] || "Chat IA"}</dd>
          <dt>Criado</dt>
          <dd>{fmtDate(lead.createdAt)}</dd>
        </dl>

        <div className="crm-agenda-box">
          <h4>Agendamento</h4>
          {lead.agendamento?.preferencia && (
            <p className="crm-dim">Preferência da pessoa: {lead.agendamento.preferencia}</p>
          )}
          <div className="crm-agenda-row">
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
            />
            <select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
              <option value="">Modalidade…</option>
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
            </select>
            <button className="btn sm" onClick={marcarConsulta}>
              Marcar consulta
            </button>
          </div>
        </div>

        <div className="crm-edit">
          <label>
            Observação interna
            <textarea rows={2} value={obs} onChange={(e) => setObs(e.target.value)} maxLength={2000} />
          </label>
          <button className="btn btn-outline sm" onClick={salvarDados}>
            Salvar dados
          </button>
        </div>

        <div className="crm-notes">
          <h4>Atividade</h4>
          <div className="crm-timeline">
            {eventos.length ? (
              eventos.map((ev, i) => (
                <div className="crm-tl-item" key={i}>
                  <p>{ev.texto}</p>
                  <span>{fmtDate(ev.em)}</span>
                </div>
              ))
            ) : (
              <div className="crm-dim">Sem atividade ainda.</div>
            )}
          </div>
          <div className="crm-note-add">
            <textarea rows={2} placeholder="Registrar nota / atividade…" value={nota} onChange={(e) => setNota(e.target.value)} />
            <button className="btn btn-outline sm" onClick={addNota}>
              Adicionar nota
            </button>
          </div>
        </div>

        <button className="btn crm-del" onClick={excluir}>
          Excluir lead
        </button>
      </div>
    </div>
  );
}
