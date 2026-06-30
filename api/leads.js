// Função serverless do Vercel — recebe o formulário de contato do site e grava
// no Firestore no schema do CRM. Requer FIREBASE_SERVICE_ACCOUNT no Vercel.

const { saveLead, getLeads, validarContato } = require("../lib/firebaseAdmin.cjs");

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

  const { nome, telefone, objetivo, mensagem } = req.body || {};
  const contato = String(telefone || "").trim();
  const erro = validarContato(nome, contato);
  if (erro) return res.status(400).json({ ok: false, error: erro });

  const isEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(contato);
  try {
    const lead = await saveLead({
      nome,
      contato,
      email: isEmail ? contato : null,
      whatsapp: isEmail ? null : contato,
      objetivo: String(objetivo || "").trim() || "",
      mensagem: String(mensagem || "").trim() || null,
      origem: "form",
    });
    return res.status(201).json({ ok: true, lead });
  } catch (err) {
    console.error("Erro ao salvar lead no Firestore:", err);
    return res.status(500).json({ ok: false, error: "Erro ao salvar contato." });
  }
};
