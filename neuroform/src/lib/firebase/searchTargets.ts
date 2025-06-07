import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    addDoc,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "@/lib/firebase/config";
  
  export const getUserTargetsRef = (userId: string) =>
    collection(db, "users", userId, "search_target");
  
  export async function createTarget(userId: string, data: any) {
    const ref = await addDoc(getUserTargetsRef(userId), data);
    return { id: ref.id, ...data };
  }
  
  export async function updateTarget(userId: string, targetId: string, data: any) {
    const ref = doc(db, "users", userId, "search_target", targetId);
    await setDoc(ref, data, { merge: true });
  }
  
  export async function deleteTarget(userId: string, targetId: string) {
    const ref = doc(db, "users", userId, "search_target", targetId);
    await deleteDoc(ref);
  }
  