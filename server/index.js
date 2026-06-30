import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const firebase = require("../lib/firebaseAdmin.cjs");
const usandoFirebase = firebase.isConfigured();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_DIR = path.join(__dirname, "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

app.use(cors());
app.use(express.json());

// Garante que o arquivo de leads exista
async function ensureLeadsFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]", "utf-8");
  }
}

async function readLeads() {
  await ensureLeadsFile();
  const raw = await fs.readFile(LEADS_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLeads(leads) {
  await ensureLeadsFile();
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "beatriz-nutri",
    storage: usandoFirebase ? "firestore" : "arquivo",
    time: new Date().toISOString(),
  });
});

// Recebe um lead do formulário de contato
app.post("/api/leads", async (req, res) => {
  const { nome, telefone, objetivo, mensagem } = req.body || {};

  if (!nome || !telefone) {
    return res.status(400).json({
      ok: false,
      error: "Nome e telefone são obrigatórios.",
    });
  }

  const lead = {
    id: Date.now().toString(36),
    nome: String(nome).trim().slice(0, 120),
    telefone: String(telefone).trim().slice(0, 40),
    objetivo: objetivo ? String(objetivo).trim().slice(0, 120) : "",
    mensagem: mensagem ? String(mensagem).trim().slice(0, 1000) : "",
    criadoEm: new Date().toISOString(),
  };

  try {
    if (usandoFirebase) {
      await firebase.saveLead(lead);
    } else {
      const leads = await readLeads();
      leads.push(lead);
      await writeLeads(leads);
    }
    return res.status(201).json({ ok: true, lead });
  } catch (err) {
    console.error("Erro ao salvar lead:", err);
    return res.status(500).json({ ok: false, error: "Erro ao salvar contato." });
  }
});

// Lista leads (uso interno simples — protegido por token opcional)
app.get("/api/leads", async (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (token && req.query.token !== token) {
    return res.status(401).json({ ok: false, error: "Não autorizado." });
  }
  try {
    const leads = usandoFirebase ? await firebase.getLeads() : await readLeads();
    res.json({ ok: true, total: leads.length, leads });
  } catch (err) {
    console.error("Erro ao listar leads:", err);
    res.status(500).json({ ok: false, error: "Erro ao listar leads." });
  }
});

// Serve o frontend buildado em produção
app.use(express.static(CLIENT_DIST));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(CLIENT_DIST, "index.html"), (err) => {
    if (err) {
      res
        .status(200)
        .send(
          "Frontend ainda não foi buildado. Rode <code>npm run build</code> na raiz e <code>npm start</code>."
        );
    }
  });
});

app.listen(PORT, () => {
  console.log(`🥗 Beatriz Nutri API rodando em http://localhost:${PORT}`);
});
