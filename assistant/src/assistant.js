// Núcleo da assistente: recebe um histórico de mensagens, chama o NVIDIA NIM com
// as ferramentas (registrar_contato / agendar_consulta) e devolve { reply, registered }.
// Reutilizado pelo servidor HTTP (site) e pelo bot de WhatsApp.
import { chatCompletion } from "./nvidia.js";
import { tools, runTool } from "./tools.js";
import { buildSystemPrompt } from "./prompt.js";

const API_KEY = process.env.NVIDIA_API_KEY;
const MODEL = process.env.NVIDIA_MODEL || "nvidia/llama-3.3-nemotron-super-49b-v1.5";
const TEMPERATURE = Number(process.env.TEMPERATURE || 0.4);
const MAX_TOOL_ROUNDS = Number(process.env.MAX_TOOL_ROUNDS || 3);
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 60_000);

// Filtro de saída (defesa em profundidade): bloqueia vazamento de instruções/stack.
const LEAK_MARKERS = [
  /assistente virtual oficial da nutricionista/i,
  /SOBRE A BEATRIZ/,
  /REGRAS DAS FERRAMENTAS/i,
  /AGENDAMENTO E CONTATO \(ferramentas\)/i,
  /ESCOPO E LIMITES/i,
  /nemotron/i,
  /system prompt/i,
  /prompt do sistema/i,
];
function filtrarSaida(text) {
  for (const re of LEAK_MARKERS) {
    if (re.test(text)) {
      console.warn("[assistant] saída bloqueada pelo filtro (possível vazamento).");
      return "Sobre esse ponto específico, prefiro confirmar com a Beatriz para te passar a informação certa. Posso registrar seu contato (nome + WhatsApp ou e-mail) para ela retornar.";
    }
  }
  return text;
}

export function hasApiKey() {
  return Boolean(API_KEY);
}

// messages: [{role:'user'|'assistant', content}]; meta: { origem, canal, conversa, whatsappId, ip }
export async function gerarResposta(messages, meta = {}) {
  if (!API_KEY) throw new Error("NVIDIA_API_KEY não definida.");
  const convo = [{ role: "system", content: buildSystemPrompt() }, ...messages];
  const conversa =
    meta.conversa ||
    messages
      .map((m) => `${m.role === "user" ? "Pessoa" : "Assistente"}: ${m.content}`)
      .join("\n")
      .slice(0, 4000);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    let resp = await chatCompletion({
      apiKey: API_KEY,
      model: MODEL,
      messages: convo,
      tools,
      temperature: TEMPERATURE,
      signal: controller.signal,
    });
    let msg = resp.choices?.[0]?.message || {};
    let registered = false;

    for (let round = 0; round < MAX_TOOL_ROUNDS && Array.isArray(msg.tool_calls) && msg.tool_calls.length; round++) {
      convo.push(msg);
      for (const tc of msg.tool_calls) {
        let args = {};
        try {
          args = JSON.parse(tc.function?.arguments || "{}");
        } catch {}
        const result = await runTool(tc.function?.name, args, { ...meta, conversa });
        if (result.registered) registered = true;
        convo.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
      }
      const lastRound = round === MAX_TOOL_ROUNDS - 1;
      resp = await chatCompletion({
        apiKey: API_KEY,
        model: MODEL,
        messages: convo,
        tools: lastRound ? undefined : tools,
        temperature: TEMPERATURE,
        signal: controller.signal,
      });
      msg = resp.choices?.[0]?.message || {};
    }

    let reply = (msg.content || "").trim() || "Desculpe, não consegui responder agora. Pode tentar de novo?";
    reply = filtrarSaida(reply);
    return { reply, registered };
  } finally {
    clearTimeout(timeout);
  }
}
