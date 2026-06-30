// Helper compartilhado do Firebase Admin (Firestore) — usado tanto pelas
// funções serverless do Vercel (api/) quanto pelo servidor Express local.
//
// As credenciais são lidas, nesta ordem:
//   1. process.env.FIREBASE_SERVICE_ACCOUNT  (JSON completo da service account)
//   2. arquivo local server/serviceAccountKey.json (gitignorado)
//
// Nada de credencial é versionado no repositório.

const admin = require("firebase-admin");

const COLLECTION = "leads";

function loadCredentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  // Fallback para desenvolvimento local
  // eslint-disable-next-line import/no-unresolved
  return require("../server/serviceAccountKey.json");
}

function isConfigured() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return true;
  try {
    require.resolve("../server/serviceAccountKey.json");
    return true;
  } catch {
    return false;
  }
}

function ensureApp() {
  if (!admin.apps.length) {
    const creds = loadCredentials();
    admin.initializeApp({ credential: admin.credential.cert(creds) });
  }
  return admin.firestore();
}

async function saveLead(lead) {
  const db = ensureApp();
  await db.collection(COLLECTION).doc(lead.id).set(lead);
  return lead;
}

async function getLeads() {
  const db = ensureApp();
  const snap = await db.collection(COLLECTION).orderBy("criadoEm", "desc").get();
  return snap.docs.map((d) => d.data());
}

module.exports = { isConfigured, saveLead, getLeads };
