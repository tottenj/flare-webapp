'use server';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { createOrgDtoType } from '@/lib/prisma/dtos/FlareOrgDto';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { zodFieldErrors } from '@/lib/utils/error/zodFeildErrors';
import { OrgSignUpFormSchema } from '@/lib/zod/org/createOrgSchema';

export default async function signUpOrg(formData: FormData): Promise<ActionResponse> {
   const rawData = Object.fromEntries(formData.entries());
   if (rawData.location && typeof rawData.location === 'string') {
     rawData.location = JSON.parse(rawData.location);
   }
   const result = OrgSignUpFormSchema.safeParse(rawData);
  if (!result.success){
    return { status: 'error', message: 'Invalid Data', errors: zodFieldErrors(result.error) };
  }

  const { data } = result;

  if (data.password != data.confirmPassword)
    return { status: 'error', message: 'Passwords must match' };

  const verifyUrl = `${process.env.FUNCTIONS_URL}/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/us-central1/addOrgClaim`;
 
  const verifyResponse = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
    },
    body: JSON.stringify({ idToken: data.idToken }),
  });

  if (!verifyResponse.ok) {
    const resp = await verifyResponse.text()
    throw new Error('Unauthorized');
  }

  const orgData: createOrgDtoType = {
    location: {
      place_id: data.location.id,
      coordinates: {
        lat: data.location.coordinates.lat,
        lng: data.location.coordinates.lng,
      },
      name: data.location.name ?? undefined,
    },
    socials: {
      twitter: data.twitter,
      facebook: data.facebook,
      instagram: data.instagram,
      other: data.other,
    },
  };
  try {
    await FlareOrg.create({email: data.email, account_type: "org"}, orgData)
  } catch (error) {
    return { status: 'error', message: 'Error Signing Up At This Time' };
  }
  return { status: 'success', message: 'Created Organization' };
}
