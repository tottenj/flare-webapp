'use server';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { ActionResponse } from '@/lib/types/ActionResponse';
import getAuthError from '@/lib/utils/error/getAuthError';
import { zodFieldErrors } from '@/lib/utils/error/zodFeildErrors';
import { formErrors } from '@/lib/utils/text/text';
import { convertFormData } from '@/lib/zod/convertFormData';
import { OrgSignUpFormSchema } from '@/lib/zod/org/createOrgSchema';

import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
} from 'firebase/auth';

export default async function orgSignUp(prevState: any, formData: FormData): Promise<ActionResponse>{
  

  const res = convertFormData(OrgSignUpFormSchema, formData)
  
  if(!res.success) {
    console.log(res.error)
    return {status: 'error', message: formErrors.requiredError, errors: zodFieldErrors(res.error)}
  }
  const {data} = res
  if (data.password != data.confirmPassword) return {status: "error", message: formErrors.passwordMisMatch };

  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const { fire } = await getFirestoreFromServer();
    const org = new FlareOrg(cred.user, data.orgName, data.location);
    await org.addOrg(fire);
    await sendEmailVerification(cred.user);
    return { message: 'Successfully Submitted Application', resp: {orgId: org.id}, status: "success" };
  } catch (error) {
    if (cred) {
      await deleteUser(cred.user);
    }
    return { message: getAuthError(error), status: "error" };
  }
}
