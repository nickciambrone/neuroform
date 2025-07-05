import { getStorage, ref, listAll, getMetadata } from "firebase/storage";

export async function listUserFiles(uid: string) {
  const storage = getStorage();
  const userFolderRef = ref(storage, `users/${uid}/pdfs`);

  const result = await listAll(userFolderRef);
  console.log(result)
  const files = await Promise.all(
    result.items.map(async (item) => {
      const metadata = await getMetadata(item);
      return {
        fullPath: item.fullPath,
        name: item.name.includes("_") ? item.name.split("_").slice(1).join("_") : item.name,
        size: metadata.size,
        timeCreated: metadata.timeCreated,
        originalName: item.name,
      };
    })
  );
  console.log('the files: ', files);
  return files;
}
