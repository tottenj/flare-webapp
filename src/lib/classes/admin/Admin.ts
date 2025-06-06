import Collections from "@/lib/enums/collections"
import { getCollectionByFields, WhereClause } from "@/lib/firebase/firestore/firestoreOperations"
import { orgConverter } from "../flareOrg/FlareOrg"
import { Firestore } from "firebase/firestore"
import { getFile } from "@/lib/firebase/storage/storageOperations"
import { FirebaseStorage } from "firebase/storage"
import { orgSocials } from "@/lib/utils/text/text"


export default class Admin {
  static async getUnverifiedOrgs(firestoredb: Firestore) {
    const arr: WhereClause[] = [];
    arr.push(['verified', '==', false]);
    return await getCollectionByFields(
      firestoredb,
      `${Collections.Organizations}`,
      arr,
      orgConverter
    );
  }

  static async getImages(firebaseStorage: FirebaseStorage, orgId: string) {
    const keys = Object.keys(orgSocials);
    keys.push("other")
    const fileLinks = await Promise.all(
      keys.map(async (key) => {
        const file = await getFile(firebaseStorage, `${Collections.Organizations}/${orgId}/${key}`);
        return file || null; // return null if no file
      })
    );

    // Filter out any nulls
    return fileLinks.filter((link): link is string => link !== null);
  }

  static async getProfilePic(firebaseStorage: FirebaseStorage, orgId:string){
    const file = await getFile(firebaseStorage, `${Collections.Organizations}/${orgId}`)
    return file || ""
  }
}

