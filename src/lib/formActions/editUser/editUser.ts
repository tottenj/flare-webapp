'use server';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { convertFormData } from '@/lib/zod/convertFormData';
import { EditUserSchema } from '@/lib/zod/user/editUserSchema';
import { revalidatePath } from 'next/cache';

export default async function editUser(prev: any, formData: FormData): Promise<ActionResponse> {
  const { fire, currentUser } = await getFirestoreFromServer();
  const result = convertFormData(EditUserSchema, formData);
  if (!result.success) return { status: 'error', message: 'Error Invalid Input' };
  if (!currentUser) return { status: 'error', message: 'Authentication Error' };
  const flareUser = await FlareUser.getUserById(currentUser?.uid, fire);
  if (!flareUser) return { status: 'error', message: 'Authentication Error' };
  try {
    await flareUser.updateUser(fire, result.data);
    revalidatePath('/dashboard', 'page');
    return { status: 'success', message: '' };
  } catch (error) {
    return { status: 'error', message: (error as Error).message };
  }
}
