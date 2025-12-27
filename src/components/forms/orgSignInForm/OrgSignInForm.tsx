'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import ServerLogo from '#src/components/flare/serverLogo/LogoWithText.js';
import FileInput from '@/components/inputs/file/FileInput';
import FormSection from '@/components/inputs/formSection/FormSection';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import { storage } from '@/lib/firebase/auth/configs/clientApp';
import { addFile } from '@/lib/firebase/storage/storageOperations';
import useFileChange from '@/lib/hooks/useFileChange/useFileChange';
import handleSignUpSubmit from '@/lib/utils/authentication/handleSignUpSubmit';
import { orgSocials } from '@/lib/utils/text/text';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function OrgSignInForm() {
  const [pending, setPending] = useState(false);
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passStatus, setPassStatus] = useState(false);
  const router = useRouter();
  const { validFiles, handleFileChange } = useFileChange();

  async function uploadFilesToFirebase(orgId: string) {
    for (const { key, file } of validFiles) {
      const path = `Organizations/${orgId}/${key}`;
      await addFile(storage, path, file);
    }
  }

  useEffect(() => {
    if (pass == confirmPass || pass == '') {
      setPassStatus(false);
    } else {
      setPassStatus(true);
    }
  }, [pass, confirmPass]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (passStatus) {
      toast.error('Passwords must match');
      return;
    }
    setPending(true);
    try {
      const uid = await handleSignUpSubmit(e, 'org');
      if (uid) await uploadFilesToFirebase(uid);
      router.push('/confirmation');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="@container mt-16 mb-8 flex h-auto w-11/12 flex-col items-center justify-center rounded-xl bg-white p-4 pt-8 pb-8 sm:w-5/6 sm:p-10 lg:w-1/2">
      <ServerLogo size="medium" />
      <h1 className="mt-4 text-center">Organization Sign Up</h1>
      <p className="mt-2 mb-8 text-center">
        Welcome to Flare! We're excited to have your organization join our vibrant community. Once
        you sign up, your account will be reviewed for verification to ensure a safe and authentic
        space for everyone. While you're pending approval, you can still create events—but they
        won’t be visible to the public until you're verified. Thanks for helping us keep Flare
        inclusive and trustworthy!
      </p>
      <form className="w-full" onSubmit={handleSubmit}>
        <FormSection text="General Information">
          <div className="flex flex-col gap-4">
            <HeroInput label="Organization Name" name="orgName" />
            <HeroInput label="Organization Email" name="email" />
            <PlaceSearch lab="Location" />
            <HeroInput
              label="Choose Password"
              name="password"
              onChange={(newVal) => setPass(newVal.target.value)}
              type="password"
            />
            <HeroInput
              label="Confirm Password"
              name="confirmPassword"
              onChange={(newVal) => setConfirmPass(newVal.target.value)}
              type="password"
              isInvalid={passStatus}
              errorMessage={'Passwords Must Match'}
            />
          </div>
        </FormSection>
        <FormSection
          text="Proof of Ownership"
          blurb="To help us verify your organization, you can optionally provide your social media handles (Instagram, Facebook, or Twitter/X) along with an image that proves you have access to the account. This speeds up the review process and helps us confirm you're representing a legitimate group. Examples of valid proof include: a screenshot showing you're logged into the account, screenshot of your profile settings or admin dashboard, recent post clearly showing your organization’s name or branding. This information stays private and is only used for verification purposes."
        >
          <div className="mt-8 flex flex-col items-center justify-between lg:flex-row">
            {Object.values(orgSocials).map((social) => (
              <div key={social} className="mt-8 flex w-[100%] flex-col md:w-[48%] lg:w-[32%]">
                <HeroInput required={false} label={social} name={social} />

                <FileInput
                  name={`${social}-file`}
                  onChange={(file) => handleFileChange(social, file)}
                  fileAdded={!!validFiles.find((f) => f.key === social)}
                />
              </div>
            ))}
          </div>

          <p className="mt-8 mb-8 pr-2 pl-2">
            If you don’t use social media or want to provide additional legitimacy, feel free to
            upload other forms of proof — like a photo of your booth at an event, a flyer, a
            business card, or a selfie at your venue with signage in the background.
          </p>

          <HeroInput
            required={false}
            style={{ marginTop: '2rem' }}
            label="Other Proof"
            name="other"
          />

          <FileInput
            onChange={(file) => handleFileChange('other', file)}
            name="other-file"
            fileAdded={!!validFiles.find((f) => f.key === 'other')}
          />
        </FormSection>
        <PrimaryButton disabled={pending} type="submit" />
      </form>
    </div>
  );
}
