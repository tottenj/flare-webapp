"use server"
import { getAuthenticatedAppForUser } from "@/lib/firebase/auth/configs/serverApp";
import storageHelper from "@/lib/firebase/storage/storageHelper";
import flareLocation from "@/lib/types/Location";
import { formErrors, orgSocials } from "@/lib/utils/places/text/text";

export default async function orgSignUp(prevState: any, formData:FormData) {

  const req = {
    name: formData.get("orgName")?.toString(),
    email: formData.get("orgEmail")?.toString(),
    locationString: formData.get("location")?.toString(),
    pass: formData.get("orgPassword")?.toString(),
    confPass: formData.get("confirmOrgPassword")
  }
  const location: flareLocation | null = req.locationString ? JSON.parse(req.locationString) : null;

  if(req.pass != req.confPass)return {message: formErrors.passwordMisMatch}
  if((Object.values(req).some((value) => value === null) || (!location))) return {message: formErrors.requiredError}

  const optional = {
    instagram: formData.get(orgSocials.instagram) as File | null,
    facebook: formData.get(orgSocials.facebook) as File | null,
    twitter: formData.get(orgSocials.twitter) as File | null,
    other: formData.get('other') as File | null,
  };

  const validFiles = Object.entries(optional).filter(([_, file]) => file && file.size > 0).map(([key, file]) => ({key, file: file!}))

  for(const ent of validFiles){
    
  }

  const {firebaseServerApp} = await getAuthenticatedAppForUser()
  const helper = new storageHelper(firebaseServerApp)
  
  


  return {message: "success"}
  
}