// Camada de dados do CRM — Firestore client SDK. O acesso é controlado pelas
// regras (firestore.rules): só usuários cujo uid está em `members` acessam
// `leads`; só `admin` gerencia `members`.
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db, criarContaFuncionario } from "../firebase.js";

// ---------- Papéis / permissões ----------
export const ROLES = {
  admin: { label: "Administrador", desc: "Acesso total, incluindo configurações e exclusão." },
  gestor: { label: "Gestor", desc: "Gerencia leads e agendamentos. Sem configurações." },
  visualizador: { label: "Visualizador", desc: "Apenas visualiza os leads." },
};
export const podeEditar = (role) => role === "admin" || role === "gestor";
export const ehAdmin = (role) => role === "admin";

// ---------- Membros ----------
export async function getMyRole(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "members", uid));
  return snap.exists() ? snap.data().role || "visualizador" : null;
}

export async function getMembers() {
  const snap = await getDocs(collection(db, "members"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

// Cria a conta de Auth + o documento do membro (papel). Roda como admin.
export async function addMember({ nome, email, senha, role }) {
  const uid = await criarContaFuncionario(email.trim(), senha, `add-${Date.now()}`);
  await setDoc(doc(db, "members", uid), {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    role,
    criadoEm: serverTimestamp(),
  });
  return uid;
}

export async function updateMemberRole(uid, role) {
  await updateDoc(doc(db, "members", uid), { role });
}

export async function removeMember(uid) {
  await deleteDoc(doc(db, "members", uid));
}

// ---------- Leads ----------
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
