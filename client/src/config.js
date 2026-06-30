// Dados de contato da profissional — ajuste aqui em um único lugar.
export const site = {
  nome: "Beatriz Batista",
  titulo: "Nutricionista Clínica e Esportiva",
  crn: "", // preencha quando tiver o número do CRN (ex.: "CRN-3 00000")
  // Número no formato internacional, só dígitos.
  whatsappNumero: "5511934690909",
  whatsappTexto: "Olá, Beatriz! Vim pelo site e quero saber mais sobre o acompanhamento.",
  email: "beatrizbatista.nutri@hotmail.com",
  instagram: "", // ex.: https://instagram.com/usuario
  instagramHandle: "",
  siteUrl: "https://beatrizbatista.com.br",
  doctoralia: "", // link do perfil no Doctoralia, se houver
  enderecoCurto: "Moema · São Paulo",
  endereco: "Av. dos Carinás, 185 — Moema, São Paulo · SP",
  enderecoSecundario: "Atendimento presencial em Moema e Avenida Paulista, e online para todo o Brasil.",
  telefoneExibicao: "(11) 93469-0909",
};

export const whatsappLink = () =>
  `https://wa.me/${site.whatsappNumero}?text=${encodeURIComponent(site.whatsappTexto)}`;

// URL pública (HTTPS) da instância da Bia (assistant) no servidor Linux.
// O widget de chat chama ${chatApiUrl}/api/chat. Vazio = chat de IA oculto.
export const chatApiUrl = (import.meta.env.VITE_CHAT_API_URL || "").replace(/\/+$/, "");
export const chatAppToken = import.meta.env.VITE_CHAT_APP_TOKEN || "";
