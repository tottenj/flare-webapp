"use server"
import { CreateDbUserSchema } from "@/lib/prisma/dtos/UserDto";
import { createUserSchema } from "@/lib/zod/auth/createUserSchema";
import { convertFormData } from "@/lib/zod/convertFormData";

export default async function signUpUser(formData:any) {
  const result = convertFormData(createUserSchema, formData)
  if(!result.success) throw new Error("Invalid Email or Password")
  const data = CreateDbUserSchema.safeParse({email: result.data.email, account_type: "user"})
  if(!data.success) throw new Error('Invalid Email or Password');
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data.data),
    cache: 'no-store'
  });
  if(!response.ok) throw new Error("Error Adding User To DB")
}