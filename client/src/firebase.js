// Inicialização do Firebase no frontend (apenas Analytics).
// Esta configuração é pública por natureza (vai para o bundle do navegador).
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCufRClSUQRl7gkCAz6LSXdUOeN6vlNABw",
  authDomain: "beatriznutri-e17a3.firebaseapp.com",
  projectId: "beatriznutri-e17a3",
  storageBucket: "beatriznutri-e17a3.firebasestorage.app",
  messagingSenderId: "377243619468",
  appId: "1:377243619468:web:76dd4ba22f787ae7bcaba9",
  measurementId: "G-8TR4Q4M3B6",
};

export const app = initializeApp(firebaseConfig);

// Analytics só funciona no navegador e em ambientes suportados (https).
export async function initAnalytics() {
  try {
    if (await isSupported()) {
      return getAnalytics(app);
    }
  } catch {
    /* ambiente sem suporte a Analytics — ignora silenciosamente */
  }
  return null;
}
