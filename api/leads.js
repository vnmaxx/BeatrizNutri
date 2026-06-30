// Função serverless do Vercel — recebe e persiste leads no Firestore (Firebase).
//
// Requer a variável de ambiente FIREBASE_SERVICE_ACCOUNT no Vercel, contendo
// o JSON completo da service account do projeto Firebase.

const { saveLead, getLeads } = require("../lib/firebaseAdmin.cjs");

function montarLead({ nome, telefone, objetivo, mensagem }) {
  return {
    id: `${Date.now().toString(36)}-${Math.floor(performance.now()).toString(36)}`,
    nome: String(nome).trim().slice(0, 120),
    telefone: String(telefone).trim().slice(0, 40),
    objetivo: objetivo ? String(objetivo).trim().slice(0, 120) : "",
    mensagem: mensagem ? String(mensagem).trim().slice(0, 1000) : "",
    criadoEm: new Date().toISOString(),
  };
}

module.exports = async (req, res) => {
  // Listagem simples (protegida por ADMIN_TOKEN, se configurado)
  if (req.method === "GET") {
    const token = process.env.ADMIN_TOKEN;
    if (token && req.query.token !== token) {
      return res.status(401).json({ ok: false, error: "Não autorizado." });
    }
    try {
      const leads = await getLeads();
      return res.status(200).json({ ok: true, total: leads.length, leads });
    } catch (err) {
      console.error("Erro ao listar leads:", err);
      return res.status(500).json({ ok: false, error: "Erro ao listar leads." });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido." });
  }

  const { nome, telefone } = req.body || {};
  if (!nome || !telefone) {
    return res.status(400).json({ ok: false, error: "Nome e telefone são obrigatórios." });
  }

  try {
    const lead = await saveLead(montarLead(req.body));
    return res.status(201).json({ ok: true, lead });
  } catch (err) {
    console.error("Erro ao salvar lead no Firestore:", err);
    return res.status(500).json({ ok: false, error: "Erro ao salvar contato." });
  }
};
