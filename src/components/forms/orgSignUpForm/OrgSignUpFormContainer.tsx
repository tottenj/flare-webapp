'use client';
import OrgSignUpFormPresentational from '@/components/forms/orgSignUpForm/OrgSignUpFormPresentational';
import { orgSignUpAction } from '@/lib/auth/orgSignUpAction';
import { buildOrgSignUpCommand } from '@/lib/auth/utils/buildOrgSignUpCommand';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import useFileMap from '@/lib/hooks/useFileMap/useFileMap';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ActionResult } from '@/lib/types/ActionResult';
import { FileKey, SocialPlatform } from '@/lib/utils/socialConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function OrgSignUpFormContainer() {
  const router = useRouter();

  const { files, hasFile, setFile  } = useFileMap<FileKey>({
    initial: {
      instagram: null,
      facebook: null,
      twitter: null,
      other: null,
    },
  });

  const [location, setLocation] = useState<LocationInput | null>(null);

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    try {
      const payload = await buildOrgSignUpCommand({ formData, location, validFiles: files });
      const result = await orgSignUpAction(payload);
      await signOut(auth);
      return result;
    } catch (err) {
      return mapFirebaseAuthError(err);
    }
  }

  const { action, pending, error, validationErrors } = useFormAction(submitAction, {
    onSuccess: () => {
      toast.success('Created Account');
      router.push('/confirmation');
    },
  });

  return (
    <OrgSignUpFormPresentational
      pending={pending}
      onSubmit={action}
      error={error?.message}
      validationErrors={validationErrors}
      handleFileChange={setFile}
      hasFile={hasFile}
      locVal={location}
      changeLocVal={setLocation}
    />
  );
}
