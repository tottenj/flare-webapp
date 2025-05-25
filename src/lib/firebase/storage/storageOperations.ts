
import { FirebaseStorage, getBlob, getBytes, getDownloadURL, getStorage, ref, uploadBytes, UploadMetadata } from "firebase/storage";



export async function getFile(storage:FirebaseStorage, pathRef:string){
    const storageRef = ref(storage, pathRef)
    const download = await getDownloadURL(storageRef)
    return download
}


export async function addFile(
  storage: FirebaseStorage,
  pathRef: string,
  data: Blob | Uint8Array | ArrayBuffer,
  metaData?: UploadMetadata
) {
  const storageRef = ref(storage, pathRef);
  console.log("Uploading File")
  const upload = await uploadBytes(storageRef, data, metaData);
  console.log("Uploaded file: ", upload.metadata, upload.ref)
  return upload
}