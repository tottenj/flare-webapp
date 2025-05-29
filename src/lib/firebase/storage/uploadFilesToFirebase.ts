import { storage } from "../auth/configs/clientApp";
import { addFile } from "./storageOperations";

  export default async function uploadFilesToFirebase(orgId: string, validFiles: { key: string; file: File }[]) {
    for (const { key, file } of validFiles) {
      const path = `Organizations/${orgId}/${key}`
      await addFile(storage, path, file);
    }
  }