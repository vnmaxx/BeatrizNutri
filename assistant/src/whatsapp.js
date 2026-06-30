// Bot de WhatsApp da Bia — INSTÂNCIA ISOLADA (sessão/processo próprios) para não
// conflitar com o responder VNMAX existente. Usa Baileys (WhatsApp self-hosted).
//
// Fluxo: mensagem recebida -> assistente NVIDIA responde -> resposta enviada ->
// contatos/agendamentos caem no MESMO CRM (Firestore) via as tools (saveLead),
// identificados por whatsappId (o número), evitando duplicar o mesmo contato.
//
// IMPORTANTE: se o seu responder atual usar OUTRA biblioteca (whatsapp-web.js,
// venom, wppconnect, Meta Cloud API), troque apenas a camada de conexão abaixo —
// o miolo (gerarResposta + saveLead) é o mesmo. Veja README do assistant/.
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import pino from "pino";
import qrcode from "qrcode-terminal";
import baileys from "@whiskeysockets/baileys";
import { gerarResposta, hasApiKey } from "./assistant.js";

const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = baileys;

const __dirname = dirname(fileURLToPath(import.meta.url));
// Sessão SEPARADA do responder atual (pasta própria) — não compartilha login.
const AUTH_DIR = process.env.WA_AUTH_DIR || resolve(__dirname, "..", "data", "wa-bia");
const MAX_HISTORY = 12;
// Só responde automaticamente se ativado (evita responder por cima de atendimento humano).
const AUTO_REPLY = process.env.WA_AUTO_REPLY !== "false";

if (!hasApiKey()) {
  console.error("[fatal] NVIDIA_API_KEY não definida. Configure assistant/.env.");
  process.exit(1);
}

// Histórico curto em memória por contato (não persiste; o CRM guarda o que importa).
const histories = new Map(); // jid -> [{role, content}]
function pushHistory(jid, role, content) {
  const arr = histories.get(jid) || [];
  arr.push({ role, content });
  histories.set(jid, arr.slice(-MAX_HISTORY));
  return histories.get(jid);
}

function textFromMessage(msg) {
  const m = msg.message;
  if (!m) return "";
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ""
  ).trim();
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    markOnlineOnConnect: false, // não marca "online" para não atrapalhar o humano
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (u) => {
    const { connection, lastDisconnect, qr } = u;
    if (qr) {
      console.log("\n[whatsapp] Escaneie o QR abaixo com o WhatsApp da Beatriz (Aparelhos conectados):\n");
      qrcode.generate(qr, { small: true });
    }
    if (connection === "open") console.log("[whatsapp] conectado ✓ (instância Bia)");
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut;
      console.warn("[whatsapp] conexão fechada.", loggedOut ? "Deslogado — apague a pasta de sessão e reconecte." : "Reconectando…");
      if (!loggedOut) start();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      try {
        if (msg.key.fromMe) continue; // ignora o que a própria conta enviou
        const jid = msg.key.remoteJid || "";
        if (jid.endsWith("@g.us") || jid.endsWith("@broadcast")) continue; // ignora grupos/status
        const texto = textFromMessage(msg);
        if (!texto) continue;
        if (!AUTO_REPLY) continue;

        const numero = jid.split("@")[0];
        const history = pushHistory(jid, "user", texto);

        await sock.sendPresenceUpdate("composing", jid).catch(() => {});
        const { reply } = await gerarResposta(history, {
          origem: "whatsapp",
          canal: "whatsapp",
          whatsappId: numero,
        });
        pushHistory(jid, "assistant", reply);
        await sock.sendMessage(jid, { text: reply });
        await sock.sendPresenceUpdate("paused", jid).catch(() => {});
      } catch (e) {
        console.error("[whatsapp] erro ao processar mensagem:", e.message);
      }
    }
  });
}

start().catch((e) => {
  console.error("[whatsapp] falha ao iniciar:", e.message);
  process.exit(1);
});
