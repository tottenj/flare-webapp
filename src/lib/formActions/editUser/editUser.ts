'use server';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { convertFormData } from '@/lib/zod/convertFormData';
import { EditUserSchema } from '@/lib/zod/user/editUserSchema';
import { revalidatePath } from 'next/cache';

export default async function editUser(prev: any, formData: FormData) {
  const {fire, currentUser} = await getFirestoreFromServer()
  const result = convertFormData(EditUserSchema, formData)
  if(!result.success) return {status: "Error Invalid Input"}
  if(!currentUser) return {status: "Authentication Error"}
  const flareUser = await FlareUser.getUserById(currentUser?.uid, fire)
  if(!flareUser) return {status: "Authentication Error"}
  try{
    await flareUser.updateUser(fire, result.data)
    revalidatePath("/dashboard", "page")
    return { status: 'success' };
  }catch(error){
    return {status: (error as Error).message}
  }
}
