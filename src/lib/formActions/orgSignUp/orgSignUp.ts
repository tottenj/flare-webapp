'use server';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import errorLocation from '@/lib/enums/errorLocations';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { getServicesFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import flareLocation from '@/lib/types/Location';
import getAuthError from '@/lib/utils/error/getAuthError';
import logErrors from '@/lib/utils/error/logErrors';
import { formErrors, orgSocials } from '@/lib/utils/text/text';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';

export default async function orgSignUp(prevState: any, formData: FormData) {
  const req = {
    name: formData.get('orgName')?.toString(),
    email: formData.get('orgEmail')?.toString(),
    locationString: formData.get('location')?.toString(),
    pass: formData.get('orgPassword')?.toString(),
    confPass: formData.get('confirmOrgPassword')?.toString(),
  };
  const location: flareLocation | null = req.locationString ? JSON.parse(req.locationString) : null;

  if (req.pass != req.confPass) return { message: formErrors.passwordMisMatch };
  if (Object.values(req).some((value) => value === null || value === undefined) || !location)
    return { message: formErrors.requiredError };

  const optional = {
    
    instagram: formData.get(orgSocials.instagram) as File | null,
    facebook: formData.get(orgSocials.facebook) as File | null,
    twitter: formData.get(orgSocials.twitter) as File | null,
    other: formData.get('other') as File | null,
  };

  const validFiles = Object.entries(optional)
    .filter(([_, file]) => file && file.size > 0)
    .map(([key, file]) => ({ key, file: file! }));

  try {
    const cred = await createUserWithEmailAndPassword(auth, req.email!, req.pass!);
    const { storage, firestore } = await getServicesFromServer();
    const org = new FlareOrg(cred.user, req.name!, location);
    await org.addOrg(firestore, storage, validFiles);
    
    await sendEmailVerification(cred.user)
    return { message: 'success' };
  } catch (error) {
    return {message: getAuthError(error)}
  }
}
