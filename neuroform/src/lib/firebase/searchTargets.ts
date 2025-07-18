import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    addDoc,
    onSnapshot,
    getDocs
  } from "firebase/firestore";
  import { db } from "@/lib/firebase/config";
  
  export const getUserTargetsRef = (userId: string) =>
    collection(db, "users", userId, "search_target");
  
  export async function createTarget(userId: string, data: any) {
    const targetWithTimestamp = {
      ...data,
      createdAt: Date.now(),
    };
  
    const ref = await addDoc(getUserTargetsRef(userId), targetWithTimestamp);
    return { id: ref.id, ...targetWithTimestamp };
  }
  
  export async function updateTarget(userId: string, id: string, data: any) {
    const ref = doc(db, "users", userId, "search_target", id);
    await setDoc(ref, data, { merge: true });
  }
  
  export async function deleteTarget(userId: string, id: string) {
    const ref = doc(db, "users", userId, "search_target", id);
    await deleteDoc(ref);
  }
  export async function fetchAllTargets(userId: string) {
    const snap = await getDocs(collection(db, "users", userId, "search_target"));
  
    const sorted = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); // fallback to 0 if missing
  
    return sorted;
  }