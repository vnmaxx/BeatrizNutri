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

export const whatsappLink = () =>
  `https://wa.me/${site.whatsappNumero}?text=${encodeURIComponent(site.whatsappTexto)}`;
