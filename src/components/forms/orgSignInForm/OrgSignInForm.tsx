'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import FileInput from '@/components/inputs/file/FileInput';
import FormSection from '@/components/inputs/formSection/FormSection';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import TextInput from '@/components/inputs/textInput/TextInput';
import { auth, storage } from '@/lib/firebase/auth/configs/clientApp';
import { addFile } from '@/lib/firebase/storage/storageOperations';
import orgSignUp from '@/lib/formActions/orgSignUp/orgSignUp';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';
import FlareLocation from '@/lib/types/Location';
import { formErrors, orgSocials } from '@/lib/utils/text/text';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

export default function OrgSignInForm() {
  const initialState = { message: '', orgId: '' };
  const [loc, setloc] = useState<FlareLocation | null>(null);
  const [state, action, pending] = useActionState(orgSignUp, initialState);
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passStatus, setPassStatus] = useState(false);
  const router = useRouter();
  const [validFiles, setValidFiles] = useState<{ key: string; file: File }[]>([]);

  useEffect(() => {
    if (state.message === 'success' && state.orgId && !pending) {
      uploadFilesToFirebase(state.orgId);
    }
  }, [state]);

  async function uploadFilesToFirebase(orgId: string) {
    for (const { key, file } of validFiles) {
      const path = `Organizations/${orgId}/${key}`;
      await addFile(storage, path, file);
    }
  }

  useActionToast(state, pending, {
    successMessage: 'success',
    loadingMessage: 'loading',
  });

  useEffect(() => {
    (async () => {
      if (state.message === 'success' && pending == false) {
        await signOut(auth);
        router.push('/confirmation');
      }
    })();
  }, [state]);

  useEffect(() => {
    if (pass == confirmPass || pass == '') {
      setPassStatus(false);
    } else {
      setPassStatus(true);
    }
  }, [pass, confirmPass]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (passStatus) {
      e.preventDefault();
    }
  }
  function handleFileChange(key: string, file: File) {
    setValidFiles((prev) => [...prev.filter((f) => f.key !== key), { key, file }]);
  }

  return (
    <div className="@container mt-8 mb-8 flex w-5/6 flex-col items-center rounded-xl bg-white p-10 lg:w-1/2">
      <h1>Flare Sign Up</h1>
      <p className="mt-8 mb-8 text-center">
        Welcome to Flare! We're excited to have your organization join our vibrant community. Once
        you sign up, your account will be reviewed for verification to ensure a safe and authentic
        space for everyone. While you're pending approval, you can still create events—but they
        won’t be visible to the public until you're verified. Thanks for helping us keep Flare
        inclusive and trustworthy!
      </p>
      <form className="w-full" action={action.bind(loc)} onSubmit={handleSubmit}>
        <FormSection text="General Information">
          <div className="mt-4 flex justify-between">
            <TextInput label="Organization Name" name="orgName" size="Double" />
            <TextInput label="Organization Email" name="orgEmail" size="Double" type="email" />
          </div>
          <div className="mb-4">
            <PlaceSearch loc={setloc} lab="Location" />
            {loc && (
              <input type="hidden" name="location" required={true} value={JSON.stringify(loc)} />
            )}
          </div>
          <TextInput
            label="Choose Password"
            name="orgPassword"
            size="XLarge"
            onChange={(newVal) => setPass(newVal)}
            type="password"
          />
          <TextInput
            label="Confirm Password"
            name="confirmOrgPassword"
            size="XLarge"
            onChange={(newVal) => setConfirmPass(newVal)}
            showErrorText={passStatus}
            errorText={formErrors.passwordMisMatch}
            type="password"
          />
        </FormSection>
        <FormSection
          text="Proof of Ownership"
          blurb="To help us verify your organization, you can optionally provide your social media handles (Instagram, Facebook, or Twitter/X) along with an image that proves you have access to the account. This speeds up the review process and helps us confirm you're representing a legitimate group. Examples of valid proof include:
A screenshot showing you're logged into the account
A screenshot of your profile settings or admin dashboard
A recent post clearly showing your organization’s name or branding
This information stays private and is only used for verification purposes."
        >
          <div className="mt-8 flex justify-between">
            {Object.values(orgSocials).map((social) => (
              <div key={social} className="flex w-[30%] flex-col">
                <TextInput reqired={false} label={social} name={social} size="Large" />
                <FileInput
                  name={social}
                  onChange={(file) => handleFileChange(social, file)}
                  fileAdded={!!validFiles.find((f) => f.key === social)}
                />
              </div>
            ))}
          </div>

          <p className="mt-8 pr-2 pl-2">
            If you don’t use social media or want to provide additional legitimacy, feel free to
            upload other forms of proof — like a photo of your booth at an event, a flyer, a
            business card, or a selfie at your venue with signage in the background.
          </p>

          <TextInput
            reqired={false}
            styleOverDiv={{ marginTop: '2rem' }}
            label="Other Proof"
            name="other"
          />
          <FileInput
            onChange={(file) => handleFileChange('other', file)}
            name="other"
            fileAdded={!!validFiles.find((f) => f.key === 'other')}
          />
        </FormSection>
        <PrimaryButton disabled={pending} type="submit" />
      </form>
    </div>
  );
}
