// Dados de contato da profissional — ajuste aqui em um único lugar.
export const site = {
  nome: "Beatriz Batista",
  crn: "[TROCAR: nº do CRN]",
  // Número no formato internacional, só dígitos. Ex.: 5511999999999
  whatsappNumero: "SEUNUMERO",
  whatsappTexto: "Olá Beatriz! Vim pelo site e gostaria de agendar uma consulta.",
  instagram: "https://instagram.com/beatrizbatista.nutri",
  instagramHandle: "@beatrizbatista.nutri",
  siteUrl: "https://beatrizbatista.com.br",
  doctoralia: "#", // [TROCAR: link do seu perfil no Doctoralia]
  endereco: "[TROCAR: endereço do consultório em São Paulo]",
  telefoneExibicao: "(XX) XXXXX-XXXX",
};

// URL pública (HTTPS) da instância da Bia (assistant) no servidor Linux.
// Ex.: https://assistant.beatrizbatista.com.br  (o widget chama ${chatApiUrl}/api/chat)
// Vazio = desabilita o chat de IA no site (continua só o WhatsApp).
export const chatApiUrl = (import.meta.env.VITE_CHAT_API_URL || "").replace(/\/+$/, "");
export const chatAppToken = import.meta.env.VITE_CHAT_APP_TOKEN || "";

export const whatsappLink = () =>
  `https://wa.me/${site.whatsappNumero}?text=${encodeURIComponent(site.whatsappTexto)}`;
