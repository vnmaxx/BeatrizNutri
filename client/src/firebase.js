// Inicialização do Firebase no frontend: Analytics (landing), Auth + Firestore (CRM).
// A configuração é pública por natureza (vai para o bundle do navegador). O acesso
// aos dados é controlado pelas regras do Firestore (allowlist) — ver firestore.rules.
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics só funciona no navegador e em ambientes suportados (https).
export async function initAnalytics() {
  try {
    if (await isSupported()) return getAnalytics(app);
  } catch {
    /* ambiente sem suporte a Analytics — ignora */
  }
  return null;
}
