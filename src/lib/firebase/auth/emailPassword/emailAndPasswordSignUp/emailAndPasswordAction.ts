'use server';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import getAuthError from '@/lib/utils/error/getAuthError';
import { convertFormData } from '@/lib/zod/convertFormData';
import { createUserSchema } from '@/lib/zod/auth/createUserSchema';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { zodFieldErrors } from '@/lib/utils/error/zodFeildErrors';
import { CreateDbUserSchema } from '@/lib/prisma/dtos/UserDto';
import { auth } from '../../configs/clientApp';



const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default async function emailAndPasswordAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const result = convertFormData(createUserSchema, formData);
  if (!result.success)
    return {
      status: 'error',
      message: 'invalid email or password',
      errors: zodFieldErrors(result.error),
    };
  const { email, password } = result.data;

  try {
    const usr = await createUserWithEmailAndPassword(auth, email, password);
    const res = CreateDbUserSchema.safeParse({ email: usr.user.email, account_type: 'user' });
    if (!res.success){ return { status: 'error', message: 'Something went wrong' }}



    const response = await fetch(`${baseUrl}/api/users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(res.data),
    });
    const json = await response.json();


    if (response.status !== 200) return { status: 'error', message: json.message || 'Something went wrong' };
    await sendEmailVerification(usr.user);
    return { message: 'success' };
  } catch (error) {
    console.log(error)
    return { status: 'error', message: getAuthError(error) };
  }
}
