// Inicialização única do firebase-admin, compartilhada por leads.js, auth.js e
// whatsapp.js. Exporta `db` (Firestore), `auth` (verifica ID tokens do CRM) e
// `admin` (FieldValue etc.). Sem credenciais, db/auth ficam null e os módulos
// degradam com mensagem clara (nada quebra no boot).
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SA_PATH = resolve(__dirname, "..", "serviceAccount.json");

let app = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    app = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    });
    console.log("[firebase] conectado (env FIREBASE_SERVICE_ACCOUNT).");
  } else if (existsSync(SA_PATH)) {
    app = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(readFileSync(SA_PATH, "utf8"))),
    });
    console.log("[firebase] conectado (serviceAccount.json).");
  } else {
    console.warn(
      "[firebase] SEM credenciais: CRM fica limitado. Coloque serviceAccount.json em assistant/ ou defina FIREBASE_SERVICE_ACCOUNT."
    );
  }
} catch (e) {
  console.warn("[firebase] falha ao iniciar:", e.message);
}

export const db = app ? admin.firestore() : null;
export const auth = app ? admin.auth() : null;
export const firebaseConfigured = Boolean(app);
export { admin };
