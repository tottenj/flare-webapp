'use server';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { CreateUserDto } from '@/lib/prisma/dtos/UserDto';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { zodFieldErrors } from '@/lib/utils/error/zodFeildErrors';
import { createUserSchema } from '@/lib/zod/auth/createUserSchema';
import { convertFormData } from '@/lib/zod/convertFormData';

export default async function signUpUser(formData: FormData): Promise<ActionResponse> {
  const result = convertFormData(createUserSchema, formData);
  if (!result.success)
    return { status: 'error', message: 'Invalid Form Data', errors: zodFieldErrors(result.error) };

  const userData: CreateUserDto = { email: result.data.email, account_type: 'user' };
  try {
    await FlareUser.create(userData)
    return {status:"success", message:"Created User"}
  } catch (error) {
    console.log(error)
    return {status:"error", message:"server error"}
  }
}
