// Ferramentas (function calling) da assistente da Bia.
// - registrar_contato: captura o lead/contato e grava via saveLead (Firestore -> CRM).
// - agendar_consulta: registra também a preferência de data/modalidade (pré-agendamento).
import { saveLead, validarContato } from "./leads.js";

export const tools = [
  {
    type: "function",
    function: {
      name: "registrar_contato",
      description:
        "Registra uma solicitação de contato de uma pessoa interessada em consulta com a nutricionista Beatriz. Use quando a pessoa quiser ser contatada, tirar dúvida sobre valores ou falar com a Beatriz. Exige nome e contato reais.",
      parameters: {
        type: "object",
        properties: {
          nome: { type: "string", description: "Nome da pessoa" },
          contato: { type: "string", description: "WhatsApp ou e-mail para retorno" },
          objetivo: {
            type: "string",
            description: "Objetivo principal (ex.: emagrecimento, reeducação alimentar, nutrição esportiva, exames)",
          },
          assunto: { type: "string", description: "Resumo da necessidade/dúvida" },
        },
        required: ["nome", "contato"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "agendar_consulta",
      description:
        "Registra uma solicitação de AGENDAMENTO de consulta quando a pessoa indica uma data/horário de preferência e/ou modalidade (online ou presencial). Exige nome e contato reais. A confirmação final do horário é feita pela Beatriz.",
      parameters: {
        type: "object",
        properties: {
          nome: { type: "string", description: "Nome da pessoa" },
          contato: { type: "string", description: "WhatsApp ou e-mail para retorno" },
          objetivo: { type: "string", description: "Objetivo principal da consulta" },
          modalidade: { type: "string", enum: ["online", "presencial"], description: "Modalidade desejada" },
          data_preferida: { type: "string", description: "Data/horário de preferência (texto livre)" },
        },
        required: ["nome", "contato", "data_preferida"],
      },
    },
  },
];

export async function runTool(name, args, meta = {}) {
  if (name === "registrar_contato") return registrarContato(args, meta);
  if (name === "agendar_consulta") return agendarConsulta(args, meta);
  return { ok: false, erro: `Ferramenta desconhecida: ${name}` };
}

function isEmail(s) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(s);
}

async function registrarContato(args, meta) {
  const nome = String(args?.nome || "").trim();
  const contato = String(args?.contato || "").trim();
  const erro = validarContato(nome, contato);
  if (erro) return { ok: false, erro };

  const res = await saveLead({
    nome,
    contato,
    email: isEmail(contato) ? contato : null,
    whatsapp: isEmail(contato) ? null : contato,
    objetivo: String(args?.objetivo || "").trim() || "",
    assunto: String(args?.assunto || "").trim() || null,
    conversa: meta.conversa || null,
    origem: meta.origem || "chat",
    canal: meta.canal || null,
    whatsappId: meta.whatsappId || null,
    ip: meta.ip || null,
  });
  if (!res.ok) return { ok: false, erro: "Falha ao registrar. Tente novamente em instantes." };
  return { ok: true, registered: true, mensagem: "Contato registrado. A Beatriz dará retorno em breve." };
}

async function agendarConsulta(args, meta) {
  const nome = String(args?.nome || "").trim();
  const contato = String(args?.contato || "").trim();
  const erro = validarContato(nome, contato);
  if (erro) return { ok: false, erro };
  const dataPref = String(args?.data_preferida || "").trim();
  if (!dataPref) return { ok: false, erro: "Informe a data/horário de preferência." };

  const res = await saveLead({
    nome,
    contato,
    email: isEmail(contato) ? contato : null,
    whatsapp: isEmail(contato) ? null : contato,
    objetivo: String(args?.objetivo || "").trim() || "",
    modalidade: args?.modalidade,
    dataPreferida: dataPref,
    conversa: meta.conversa || null,
    origem: meta.origem || "chat",
    canal: meta.canal || null,
    whatsappId: meta.whatsappId || null,
    ip: meta.ip || null,
  });
  if (!res.ok) return { ok: false, erro: "Falha ao agendar. Tente novamente em instantes." };
  return {
    ok: true,
    registered: true,
    mensagem: "Solicitação de agendamento registrada. A Beatriz confirma o horário com você em breve.",
  };
}
