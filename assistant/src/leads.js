// Persistência de leads/pacientes: grava no Firestore (alimenta o CRM) e mantém
// backup local em data/leads.jsonl. Sem credenciais Firebase, funciona só com o
// backup local. Usado pelo chat (tools), pelo /api/contact e pelo WhatsApp.
import { appendFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { db, admin } from "./firebase-admin.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "..", "data");
const LEADS_FILE = resolve(DATA_DIR, "leads.jsonl");

// Valida nome + contato (e-mail OU telefone BR). Rejeita placeholders/lixo.
export function validarContato(nome, contato) {
  nome = String(nome || "").trim();
  contato = String(contato || "").trim();
  if (!nome || !contato) return "Informe nome e um contato (WhatsApp ou e-mail).";
  const blob = `${nome} ${contato}`.toLowerCase();
  if (/(seu[ _-]?nome|nome do|fulano|exemplo|example|email@|user@|placeholder|\bxxx\b|asdf|qwerty)/.test(blob))
    return "Parecem dados de exemplo. Informe dados reais.";
  if ((nome.match(/\p{L}/gu) || []).length < 2 || /^(.)\1+$/.test(nome.replace(/\s/g, "")))
    return "Nome inválido.";
  const isEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(contato);
  const fakeEmail =
    isEmail &&
    (/^(.)\1{3,}@/.test(contato) ||
      /@(example|exemplo|test|teste|mailinator|tempmail)\./i.test(contato) ||
      /\.(test|example|invalid|local)$/i.test(contato));
  const dig = (contato.match(/\d/g) || []).join("");
  const seq = /^(\d)\1+$/.test(dig) || /0123456789|1234567890|12345678/.test(dig);
  const isPhone = dig.length >= 10 && dig.length <= 13 && !seq;
  if (isEmail && fakeEmail) return "E-mail parece de teste. Informe um e-mail válido.";
  if (!isEmail && !isPhone) return "Contato inválido. Use um WhatsApp com DDD ou um e-mail válido.";
  return null; // ok
}

function detectCanal(contato, email, whatsapp) {
  if (email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(contato || ""))) return "email";
  const c = String(whatsapp || contato || "");
  if (whatsapp || (c.match(/\d/g) || []).length >= 8) return "whatsapp";
  return "";
}

// Grava um lead enriquecido. `input`: { nome, contato, email, whatsapp, objetivo,
// assunto, mensagem, modalidade, dataPreferida, origem, conversa, canal, ip,
// whatsappId }
export async function saveLead(input = {}) {
  const nome = String(input.nome || "").trim().slice(0, 120);
  const contato = String(input.contato || "").trim().slice(0, 160);
  const email = input.email ? String(input.email).trim().slice(0, 160) : null;
  const whatsapp = input.whatsapp ? String(input.whatsapp).trim().slice(0, 60) : null;
  const objetivo = input.objetivo ? String(input.objetivo).trim().slice(0, 160) : "";
  const assunto = input.assunto ? String(input.assunto).trim().slice(0, 200) : null;
  const mensagem = input.mensagem ? String(input.mensagem).trim().slice(0, 2000) : null;
  const modalidade = input.modalidade === "presencial" || input.modalidade === "online" ? input.modalidade : "";
  const dataPreferida = input.dataPreferida ? String(input.dataPreferida).trim().slice(0, 120) : "";
  const origem = ["form", "chat", "whatsapp"].includes(input.origem) ? input.origem : "chat";
  const em = Date.now();

  const origemTexto = {
    form: "Lead recebido pelo formulário do site.",
    chat: "Lead recebido pelo chat de IA do site.",
    whatsapp: "Lead recebido pelo WhatsApp.",
  }[origem];

  const historico = [{ tipo: "origem", texto: origemTexto, em }];
  if (mensagem) historico.push({ tipo: "mensagem", texto: mensagem, em });
  else if (assunto) historico.push({ tipo: "mensagem", texto: assunto, em });
  if (dataPreferida)
    historico.push({ tipo: "agenda", texto: `Preferência informada: ${dataPreferida}${modalidade ? ` (${modalidade})` : ""}`, em });
  if (input.conversa) historico.push({ tipo: "conversa", texto: String(input.conversa).slice(0, 4000), em });

  // Se há preferência de data/horário, o lead já entra como pré-agendamento.
  const agendamento = dataPreferida
    ? { status: "solicitado", modalidade: modalidade || "", preferencia: dataPreferida, dataHora: null }
    : null;

  const lead = {
    nome,
    contato,
    email,
    whatsapp,
    objetivo,
    canal: input.canal || detectCanal(contato, email, whatsapp),
    assunto,
    mensagem,
    modalidade,
    origem,
    stage: dataPreferida ? "AGENDADO" : "NOVO",
    agendamento,
    observacao: "",
    historico,
    whatsappId: input.whatsappId || null,
    ip: input.ip || null,
  };

  // Backup local (sempre).
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(LEADS_FILE, JSON.stringify({ ...lead, ts: new Date().toISOString() }) + "\n", "utf8");
  } catch {}

  // Firestore (alimenta o CRM).
  if (db) {
    try {
      // Se veio do WhatsApp e já existe lead com o mesmo whatsappId aberto, anexa
      // evento em vez de duplicar (mesma pessoa conversando).
      if (input.whatsappId) {
        const dup = await db
          .collection("leads")
          .where("whatsappId", "==", input.whatsappId)
          .limit(1)
          .get();
        if (!dup.empty) {
          const ref = dup.docs[0].ref;
          await ref.update({
            historico: admin.firestore.FieldValue.arrayUnion(...historico.filter((h) => h.tipo !== "origem")),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            ...(agendamento ? { agendamento, stage: "AGENDADO" } : {}),
          });
          return { ok: true, id: ref.id, deduped: true };
        }
      }
      const ref = await db.collection("leads").add({
        ...lead,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { ok: true, id: ref.id };
    } catch (e) {
      console.error("[leads] Falha ao gravar no Firestore (lead salvo no backup local):", e.message);
    }
  }
  return { ok: true, id: null };
}
