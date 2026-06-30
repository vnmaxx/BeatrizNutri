import { useEffect, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import {
  ROLES,
  podeEditar,
  ehAdmin,
  getMyRole,
  getMembers,
  addMember,
  updateMemberRole,
  removeMember,
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
  const [role, setRole] = useState(null);
  const [carregandoRole, setCarregandoRole] = useState(false);
  const [erroLogin, setErroLogin] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        setCarregandoRole(true);
        try {
          setRole(await getMyRole(u.uid));
        } catch {
          setRole(null);
        } finally {
          setCarregandoRole(false);
        }
      } else {
        setRole(null);
      }
    });
  }, []);

  async function entrar(e) {
    e?.preventDefault();
    setErroLogin("");
    if (!email.trim() || !senha) {
      setErroLogin("Informe e-mail e senha.");
      return;
    }
    setEntrando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (err) {
      const code = err?.code || "";
      const msg =
        code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
          ? "E-mail ou senha incorretos."
          : code === "auth/too-many-requests"
            ? "Muitas tentativas. Aguarde um momento e tente de novo."
            : err.message || "Falha no login.";
      setErroLogin(msg);
    } finally {
      setEntrando(false);
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
        <form className="crm-login" onSubmit={entrar}>
          <div className="crm-login-mark">BB</div>
          <h1>CRM · Beatriz Batista</h1>
          <p>Acesso restrito à equipe. Entre com seu e-mail e senha.</p>
          <div className="crm-login-fields">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn" type="submit" disabled={entrando} style={{ width: "100%" }}>
            {entrando ? "Entrando..." : "Entrar"}
          </button>
          {erroLogin && <p className="crm-err">{erroLogin}</p>}
        </form>
      </div>
    );
  }

  if (carregandoRole) {
    return (
      <div className="crm-shell crm-center">
        <span className="crm-spinner" /> Verificando acesso…
      </div>
    );
  }

  if (!role) {
    return (
      <div className="crm-shell crm-center">
        <div className="crm-login">
          <div className="crm-login-mark" style={{ background: "#ff4d4f" }}>
            !
          </div>
          <h1>Acesso não autorizado</h1>
          <p>
            A conta <b>{user.email}</b> ainda não tem acesso ao CRM. Peça a um administrador para
            adicioná-la em Configurações.
          </p>
          <button className="btn btn-outline" onClick={() => signOut(auth)}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  return <Shell user={user} role={role} />;
}

function Shell({ user, role }) {
  const [view, setView] = useState("funil");
  const admin = ehAdmin(role);

  return (
    <div className="crm-shell">
      <header className="crm-top">
        <div className="crm-top-brand">
          <span className="crm-login-mark sm">BB</span>
          <strong>CRM · Beatriz Batista</strong>
          <nav className="crm-nav">
            <button className={view === "funil" ? "on" : ""} onClick={() => setView("funil")}>
              Funil
            </button>
            {admin && (
              <button className={view === "config" ? "on" : ""} onClick={() => setView("config")}>
                Configurações
              </button>
            )}
          </nav>
        </div>
        <div className="crm-top-user">
          <span className="crm-role-badge">{ROLES[role]?.label || role}</span>
          <span>{user.email}</span>
          <button className="btn btn-outline sm" onClick={() => signOut(auth)}>
            Sair
          </button>
        </div>
      </header>

      {view === "funil" ? <Board role={role} /> : <Settings meUid={user.uid} />}
    </div>
  );
}

function Board({ role }) {
  const editar = podeEditar(role);
  const admin = ehAdmin(role);
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
    if (!editar) return;
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
        {!editar && <span className="crm-readonly">Somente leitura</span>}
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
                if (!editar) return;
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
                    draggable={editar}
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

      {openLead && (
        <Drawer
          lead={openLead}
          editar={editar}
          admin={admin}
          onClose={() => setOpenId(null)}
          onChange={(patch) => setLeads((arr) => arr.map((l) => (l.id === openLead.id ? { ...l, ...patch } : l)))}
          onDelete={() => {
            setLeads((arr) => arr.filter((l) => l.id !== openLead.id));
            setOpenId(null);
          }}
          onMove={mover}
        />
      )}
    </main>
  );
}

function Drawer({ lead, editar, admin, onClose, onChange, onDelete, onMove }) {
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
              disabled={!editar}
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

        {editar && (
          <div className="crm-agenda-box">
            <h4>Agendamento</h4>
            {lead.agendamento?.preferencia && (
              <p className="crm-dim">Preferência da pessoa: {lead.agendamento.preferencia}</p>
            )}
            <div className="crm-agenda-row">
              <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} />
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
        )}

        {editar && (
          <div className="crm-edit">
            <label>
              Observação interna
              <textarea rows={2} value={obs} onChange={(e) => setObs(e.target.value)} maxLength={2000} />
            </label>
            <button className="btn btn-outline sm" onClick={salvarDados}>
              Salvar dados
            </button>
          </div>
        )}

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
          {editar && (
            <div className="crm-note-add">
              <textarea rows={2} placeholder="Registrar nota / atividade…" value={nota} onChange={(e) => setNota(e.target.value)} />
              <button className="btn btn-outline sm" onClick={addNota}>
                Adicionar nota
              </button>
            </div>
          )}
        </div>

        {admin && (
          <button className="btn crm-del" onClick={excluir}>
            Excluir lead
          </button>
        )}
      </div>
    </div>
  );
}

function Settings({ meUid }) {
  const [members, setMembers] = useState(null);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({ nome: "", email: "", senha: "", role: "gestor" });
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState({ tipo: null, texto: "" });

  async function carregar() {
    setErro("");
    try {
      setMembers(await getMembers());
    } catch (e) {
      setErro(e.message || "Falha ao carregar membros.");
      setMembers([]);
    }
  }
  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(e) {
    e.preventDefault();
    setMsg({ tipo: null, texto: "" });
    if (!form.nome.trim() || !form.email.trim() || form.senha.length < 6) {
      setMsg({ tipo: "err", texto: "Preencha nome, e-mail e uma senha de pelo menos 6 caracteres." });
      return;
    }
    setSalvando(true);
    try {
      await addMember(form);
      setMsg({ tipo: "ok", texto: `Funcionário ${form.nome} adicionado. Ele já pode entrar com esse e-mail e senha.` });
      setForm({ nome: "", email: "", senha: "", role: "gestor" });
      await carregar();
    } catch (err) {
      const code = err?.code || "";
      const texto =
        code === "auth/email-already-in-use"
          ? "Já existe uma conta com esse e-mail."
          : code === "auth/invalid-email"
            ? "E-mail inválido."
            : code === "auth/weak-password"
              ? "Senha muito fraca (mínimo 6 caracteres)."
              : err.message || "Falha ao adicionar.";
      setMsg({ tipo: "err", texto });
    } finally {
      setSalvando(false);
    }
  }

  async function mudarPapel(uid, role) {
    try {
      await updateMemberRole(uid, role);
      setMembers((arr) => arr.map((m) => (m.uid === uid ? { ...m, role } : m)));
    } catch (e) {
      alert("Falha ao alterar papel: " + e.message);
    }
  }

  async function remover(uid, nome) {
    if (!confirm(`Remover o acesso de ${nome || "este funcionário"}? (a conta de login continua existindo, mas perde acesso ao CRM)`)) return;
    try {
      await removeMember(uid);
      setMembers((arr) => arr.filter((m) => m.uid !== uid));
    } catch (e) {
      alert("Falha ao remover: " + e.message);
    }
  }

  return (
    <main className="crm-main">
      <div className="crm-settings">
        <section className="crm-panel">
          <h2>Adicionar funcionário</h2>
          <p className="crm-dim">
            Cria a conta de login e define o nível de permissão. A pessoa entra direto com o e-mail e
            a senha definidos aqui.
          </p>
          <form className="crm-member-form" onSubmit={adicionar}>
            <input
              type="text"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />
            <input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Senha (mín. 6)"
              value={form.senha}
              onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
            />
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              {Object.entries(ROLES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <button className="btn" type="submit" disabled={salvando}>
              {salvando ? "Adicionando..." : "Adicionar"}
            </button>
          </form>
          {msg.tipo && <div className={`form-msg ${msg.tipo === "ok" ? "ok" : "err"} crm-msg`}>{msg.texto}</div>}
          <div className="crm-roles-help">
            {Object.entries(ROLES).map(([k, v]) => (
              <div key={k}>
                <b>{v.label}:</b> {v.desc}
              </div>
            ))}
          </div>
        </section>

        <section className="crm-panel">
          <h2>Equipe com acesso</h2>
          {erro && <p className="crm-err">{erro}</p>}
          {members === null ? (
            <p className="crm-dim">
              <span className="crm-spinner" /> Carregando…
            </p>
          ) : members.length === 0 ? (
            <p className="crm-dim">Nenhum membro cadastrado ainda.</p>
          ) : (
            <table className="crm-members">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Permissão</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.uid}>
                    <td>{m.nome || "—"}</td>
                    <td>{m.email || "—"}</td>
                    <td>
                      <select
                        value={m.role || "visualizador"}
                        disabled={m.uid === meUid}
                        onChange={(e) => mudarPapel(m.uid, e.target.value)}
                      >
                        {Object.entries(ROLES).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {m.uid !== meUid && (
                        <button className="btn btn-outline sm" onClick={() => remover(m.uid, m.nome)}>
                          Remover
                        </button>
                      )}
                      {m.uid === meUid && <span className="crm-dim">você</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
