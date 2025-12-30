import firebaseSignUpHelper from '@/lib/auth/firebaseSignUpHelper';
import { OrgSignUpInput } from '@/lib/schemas/auth/orgSignUpSchema';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import uploadSocialFile from '@/lib/storage/uploadSocialFile';
import { SOCIAL_CONFIG, SocialPlatform } from '@/lib/utils/socialConfig';

// orgSignUpCommand.ts
export async function buildOrgSignUpCommand({
  formData,
  location,
  validFiles,
}: {
  formData: FormData;
  location: LocationInput | null;
  validFiles: Record<string, File | null>;
}): Promise<OrgSignUpInput> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const orgName = formData.get('orgName') as string;

  if (!email || !password || !orgName || !location) {
    throw new Error('INVALID_INPUT');
  }

  const { idToken, uid } = await firebaseSignUpHelper(email, password);

  const proofs = [];
  for (const [key, file] of Object.entries(validFiles)) {
    if (!file) continue;
    proofs.push(await uploadSocialFile(file, uid, key as any));
  }

  const socials = [...formData.entries()]
    .filter(([key, value]) => typeof value === 'string' && value.length > 0)
    .filter(([key]) => key in SOCIAL_CONFIG)
    .map(([key, value]) => ({
      platform: SOCIAL_CONFIG[key as SocialPlatform].platform,
      handle: value as string,
    }));

  return {
    idToken,
    org: {
      name: orgName,
      email,
      location,
    },
    socials: socials.length ? socials : undefined,
    proofs,
  };
}
