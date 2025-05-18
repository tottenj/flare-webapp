import "server-only"
import { FirebaseServerApp } from "firebase/app";
import { FirebaseStorage, getStorage, ref, uploadBytes } from "firebase/storage";



export default class storageHelper{
    app: FirebaseServerApp
    storage: FirebaseStorage

    constructor(app: FirebaseServerApp){
        this.app = app
        this.storage = getStorage(app)
    }

    async uploadFile(path: string, file: File | Blob){
        const storageRef = ref(this.storage, path)
        return await uploadBytes(storageRef, file)
    }

}