import OrgSignUpFormPresentational from '@/components/forms/orgSignUpForm/OrgSignUpFormPresentational';
import { orgSignUpAction } from '@/lib/auth/orgSignUpAction';
import { buildOrgSignUpCommand } from '@/lib/auth/utils/buildOrgSignUpCommand';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import useFileChange from '@/lib/hooks/useFileChange/useFileChange';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { ActionResult } from '@/lib/types/ActionResult';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function OrgSignUpFormContainer() {
  const router = useRouter();
  const { handleFileChange, hasFile, validFiles } = useFileChange();
  const [location, setLocation] = useState<LocationInput | null>(null);

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    try {
      const payload = await buildOrgSignUpCommand({formData, location, validFiles})
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
      handleFileChange={handleFileChange}
      hasFile={hasFile}
      locVal={location}
      changeLocVal={setLocation}
    />
  );
}
