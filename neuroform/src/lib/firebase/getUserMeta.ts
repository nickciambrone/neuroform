import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function fetchUserMeta(userId: string) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data(); // e.g. { email: ..., name: ... }
}
