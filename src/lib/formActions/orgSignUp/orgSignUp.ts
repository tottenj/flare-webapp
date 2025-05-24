'use server';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import errorLocation from '@/lib/enums/errorLocations';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import getFirestoreFromServer, { getServicesFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import flareLocation from '@/lib/types/Location';
import getAuthError from '@/lib/utils/error/getAuthError';
import logErrors from '@/lib/utils/error/logErrors';
import { formErrors, orgSocials } from '@/lib/utils/text/text';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { or } from 'firebase/firestore';

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


  try {
    const cred = await createUserWithEmailAndPassword(auth, req.email!, req.pass!);
    const {fire} = await getFirestoreFromServer()
    const org = new FlareOrg(cred.user, req.name!, location);
    await org.addOrg(fire);
    console.log("added")
    await sendEmailVerification(cred.user)
    return { message: 'success', orgId: org.id };
  } catch (error) {
    return {message: getAuthError(error)}
  }
}
