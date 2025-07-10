import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/config";

export async function savePDFForUser(userId: string, file: File) {
  console.log("STORAGE SDK VERSION:", storage.app.options);
console.log("File object:", file);
  const timestamp = Date.now();
  const storagePath = `users/${userId}/pdfs/${timestamp}_${file.name}`;
  const fileRef = ref(storage, storagePath);

  // Upload to Firebase Storage
  await uploadBytes(fileRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(fileRef);

  // Save metadata in Firestore
  await addDoc(collection(db, "users", userId, "savedDocuments"), {
    fileName: `${timestamp}_${file.name}`,
    storagePath,
    downloadURL,
    uploadedAt: timestamp,
  });
  return `${timestamp}_${file.name}`;
}
