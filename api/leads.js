// Função serverless do Vercel — recebe leads do formulário de contato.
//
// Observação: no Vercel o sistema de arquivos é efêmero (somente /tmp e somente
// durante a execução), então NÃO há persistência permanente em arquivo. Para
// guardar os leads de verdade em produção, conecte um banco/serviço aqui
// (ex.: Supabase, Postgres, Google Sheets, ou um webhook/e-mail).
//
// Por enquanto a função valida e registra o lead no log da função. O formulário
// do site também oferece o WhatsApp como canal direto.

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Método não permitido." });
  }

  const { nome, telefone, objetivo, mensagem } = req.body || {};

  if (!nome || !telefone) {
    return res
      .status(400)
      .json({ ok: false, error: "Nome e telefone são obrigatórios." });
  }

  const lead = {
    id: Date.now().toString(36),
    nome: String(nome).trim().slice(0, 120),
    telefone: String(telefone).trim().slice(0, 40),
    objetivo: objetivo ? String(objetivo).trim().slice(0, 120) : "",
    mensagem: mensagem ? String(mensagem).trim().slice(0, 1000) : "",
    criadoEm: new Date().toISOString(),
  };

  // Aparece nos logs da função no painel do Vercel.
  console.log("Novo lead recebido:", JSON.stringify(lead));

  return res.status(201).json({ ok: true, lead });
}
