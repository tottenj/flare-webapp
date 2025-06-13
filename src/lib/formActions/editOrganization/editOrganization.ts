'use server';

import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import flareLocation from '@/lib/types/Location';
import { revalidatePath } from 'next/cache';

export default async function editOrganization(prevState: any, formData: FormData) {
  const { currentUser, fire } = await getFirestoreFromServer();

  if (!currentUser) return { message: 'Must be logged in to edit details' };

  const email = formData.get('email')?.toString();
  const name = formData.get('name')?.toString();
  const locationString = formData.get('location') as string;
  const bio = formData.get("bio")?.toString()

  let location: flareLocation | null = null;
  if (locationString) {
    try {
      location = JSON.parse(locationString);
    } catch {
      return { message: 'Invalid location format' };
    }
  }

  const flareOrg = await FlareOrg.getOrg(fire, currentUser.uid);
  if (!flareOrg) return { message: 'Organization not found' };

  // Build update object dynamically
  const update: Partial<FlareOrg> = {};
  if (bio) update.description = bio;
  if (email) update.email = email;
  if (name) update.name = name;
  if (location) update.location = location;

  await flareOrg.updateOrg(fire, update);
  revalidatePath("/dashboard")
  return { message: 'success' };
}
