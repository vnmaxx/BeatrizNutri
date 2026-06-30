// Camada de dados do CRM — Firestore client SDK. O acesso é controlado pelas
// regras (firestore.rules): só usuários autenticados cujo uid está na coleção
// `allowlist` conseguem ler/escrever `leads`.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

export async function isAllowed(uid) {
  if (!uid) return false;
  const snap = await getDoc(doc(db, "allowlist", uid));
  return snap.exists();
}

export async function getLeads() {
  const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateLeadStage(id, stage) {
  await updateDoc(doc(db, "leads", id), {
    stage,
    updatedAt: serverTimestamp(),
    historico: arrayUnion({ tipo: "stage", texto: `Movido para ${stage}`, em: Date.now() }),
  });
}

export async function updateLeadFields(id, fields) {
  await updateDoc(doc(db, "leads", id), { ...fields, updatedAt: serverTimestamp() });
}

export async function addLeadEvent(id, tipo, texto) {
  await updateDoc(doc(db, "leads", id), {
    updatedAt: serverTimestamp(),
    historico: arrayUnion({ tipo, texto, em: Date.now() }),
  });
}

export async function setAgendamento(id, agendamento) {
  await updateDoc(doc(db, "leads", id), {
    agendamento,
    stage: "AGENDADO",
    updatedAt: serverTimestamp(),
    historico: arrayUnion({
      tipo: "agenda",
      texto: `Consulta marcada: ${agendamento.dataHora || agendamento.preferencia || "—"}${agendamento.modalidade ? ` (${agendamento.modalidade})` : ""}`,
      em: Date.now(),
    }),
  });
}

export async function deleteLead(id) {
  await deleteDoc(doc(db, "leads", id));
}
