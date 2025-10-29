import { ActionResponse } from '@/lib/types/ActionResponse';
import signUpOrg from './signUpOrg/signUpOrg';
import signUpUser from './signUpUser/signUpUser';

export async function handleSignUp(
  accountType: string,
  formData: FormData
): Promise<ActionResponse> {
  if (accountType === 'org') {
    return await signUpOrg(formData);
  } else if (accountType === 'user') {
    return await signUpUser(formData);
  } else {
    return { status: 'error', message: 'Invalid account type' };
  }
}
