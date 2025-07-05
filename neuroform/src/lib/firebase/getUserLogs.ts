import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export const getUserLogsRef = (userId: string) =>
  collection(db, "users", userId, "extractedLogs");

export async function fetchUserLogs(userId: string) {
  const snap = await getDocs(getUserLogsRef(userId));

  const sorted = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort(
      (a, b) =>
        (b.timestamp?.toDate?.()?.getTime?.() || 0) -
        (a.timestamp?.toDate?.()?.getTime?.() || 0)
    );

  return sorted;
}
