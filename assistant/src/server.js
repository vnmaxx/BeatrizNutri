// Servidor HTTP da instância da Bia (NVIDIA NIM). Serve o chat do site e o
// formulário de contato. INSTÂNCIA SEPARADA do responder VNMAX: porta e processo
// próprios. A chave da NVIDIA fica só aqui (.env), nunca no frontend.
import { createServer } from "node:http";
import { gerarResposta, hasApiKey } from "./assistant.js";
import { chatCompletion } from "./nvidia.js";
import { saveLead, validarContato } from "./leads.js";

const PORT = Number(process.env.PORT || 8788); // 8788: separado do VNMAX (8787)
const API_KEY = process.env.NVIDIA_API_KEY;
const MODEL = process.env.NVIDIA_MODEL || "nvidia/llama-3.3-nemotron-super-49b-v1.5";
const MAX_MESSAGES = Number(process.env.MAX_MESSAGES || 12);
const MAX_CHARS = Number(process.env.MAX_CHARS || 4000);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ALLOW_ANY = ALLOWED_ORIGINS.includes("*");
const APP_TOKEN = process.env.APP_TOKEN || "";
const TRUST_PROXY = process.env.TRUST_PROXY === "true";

if (!hasApiKey()) {
  console.error("[fatal] NVIDIA_API_KEY não definida. Configure assistant/.env.");
  process.exit(1);
}
if (!ALLOWED_ORIGINS.length) {
  console.warn("[aviso] ALLOWED_ORIGINS vazio — requisições cross-origin de navegador serão bloqueadas.");
}

// ---- rate limit simples por IP ----
const RATE_MAX = Number(process.env.RATE_MAX || 20);
const RATE_WINDOW_MS = Number(process.env.RATE_WINDOW_MS || 60_000);
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  return arr.length > RATE_MAX;
}
function clientIp(req) {
  if (TRUST_PROXY) {
    const xff = (req.headers["x-forwarded-for"] || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (xff.length) return xff[xff.length - 1];
  }
  return req.socket.remoteAddress || "unknown";
}
function corsOrigin(reqOrigin) {
  if (ALLOW_ANY) return reqOrigin || "*";
  return reqOrigin && ALLOWED_ORIGINS.includes(reqOrigin) ? reqOrigin : "";
}
function setCors(res, origin) {
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Bia-Token, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}
function json(res, status, obj, origin) {
  setCors(res, origin);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}
function readBody(req, limit = 32_768) {
  return new Promise((resolve, reject) => {
    let data = "", size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("payload muito grande"));
        req.destroy();
      } else data += c;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}
function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const out = [];
  for (const m of raw) {
    if (!m || typeof m.content !== "string") continue;
    const role = m.role === "assistant" ? "assistant" : "user";
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) out.push({ role, content });
  }
  return out.slice(-MAX_MESSAGES);
}

async function handleChat(req, res, origin, ip) {
  let body;
  try {
    body = JSON.parse((await readBody(req)) || "{}");
  } catch {
    return json(res, 400, { error: "JSON inválido." }, origin);
  }
  const messages = sanitizeMessages(body.messages);
  if (!messages || !messages.length) return json(res, 400, { error: "Envie ao menos uma mensagem." }, origin);
  try {
    const { reply, registered } = await gerarResposta(messages, { origem: "chat", canal: "site", ip });
    return json(res, 200, { reply, registered }, origin);
  } catch (e) {
    const aborted = e.name === "AbortError";
    console.error("[chat] erro:", e.message);
    return json(
      res,
      aborted ? 504 : 502,
      { error: aborted ? "A assistente demorou para responder. Tente novamente." : "Falha ao falar com a assistente. Tente novamente em instantes." },
      origin
    );
  }
}

async function handleContact(req, res, origin, ip) {
  let body;
  try {
    body = JSON.parse((await readBody(req)) || "{}");
  } catch {
    return json(res, 400, { error: "JSON inválido." }, origin);
  }
  const nome = String(body.nome || "").trim();
  const email = String(body.email || "").trim();
  const whatsapp = String(body.whatsapp || body.telefone || "").trim();
  const contato = email || whatsapp;
  const erro = validarContato(nome, contato);
  if (erro) return json(res, 400, { error: erro }, origin);
  try {
    await saveLead({
      nome,
      contato,
      email: email || null,
      whatsapp: whatsapp || null,
      objetivo: String(body.objetivo || "").trim() || "",
      assunto: String(body.assunto || "").trim() || null,
      mensagem: String(body.mensagem || "").trim() || null,
      origem: "form",
      ip,
    });
    return json(res, 200, { ok: true }, origin);
  } catch (e) {
    console.error("[contact] erro:", e.message);
    return json(res, 502, { error: "Não foi possível enviar agora. Tente novamente." }, origin);
  }
}

const server = createServer(async (req, res) => {
  const origin = corsOrigin(req.headers.origin);
  const ip = clientIp(req);

  if (req.method === "OPTIONS") {
    setCors(res, origin);
    res.writeHead(204);
    return res.end();
  }
  if (req.method === "GET" && req.url === "/api/health") return json(res, 200, { ok: true }, origin);

  if (req.method === "POST" && (req.url === "/api/chat" || req.url === "/api/contact")) {
    if (APP_TOKEN && req.headers["x-bia-token"] !== APP_TOKEN) return json(res, 401, { error: "Não autorizado." }, origin);
    if (!ALLOW_ANY && (!req.headers.origin || !origin)) return json(res, 403, { error: "Origem não autorizada." }, "");
    if (rateLimited(ip)) return json(res, 429, { error: "Muitas requisições. Aguarde um momento." }, origin);
    return req.url === "/api/contact" ? handleContact(req, res, origin, ip) : handleChat(req, res, origin, ip);
  }
  json(res, 404, { error: "Rota não encontrada." }, origin);
});

async function warmup() {
  try {
    await chatCompletion({ apiKey: API_KEY, model: MODEL, messages: [{ role: "user", content: "ok" }], temperature: 0, maxTokens: 1 });
    console.log("[bia-assistant] modelo pré-aquecido.");
  } catch (e) {
    console.warn("[bia-assistant] warmup falhou:", e.message);
  }
}
const KEEPALIVE_MS = Number(process.env.KEEPALIVE_MS || 0);

server.listen(PORT, () => {
  console.log(`[bia-assistant] ouvindo na porta ${PORT} · modelo ${MODEL}`);
  console.log(`[bia-assistant] origens: ${ALLOW_ANY ? "* (teste)" : ALLOWED_ORIGINS.join(", ") || "(nenhuma)"} · token: ${APP_TOKEN ? "on" : "off"}`);
  warmup();
  if (KEEPALIVE_MS > 0) setInterval(warmup, KEEPALIVE_MS).unref();
});
