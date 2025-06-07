import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { User } from "firebase/auth";

export async function createUserDocument(user: User) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    createdAt: Date.now(),
  }, { merge: true });
}
