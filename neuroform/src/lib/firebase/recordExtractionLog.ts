import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function recordExtractionLog(uid: string, fileName: string, data: Record<string, any>) {
  const userLogsRef = collection(db, "users", uid, "extractedLogs");

  await addDoc(userLogsRef, {
    fileName,
    timestamp: serverTimestamp(),
    data,
  });
}
