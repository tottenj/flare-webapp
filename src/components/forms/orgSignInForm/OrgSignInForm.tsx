'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import FileInput from '@/components/inputs/file/FileInput';
import FormSection from '@/components/inputs/formSection/FormSection';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import useFileChange from '@/lib/hooks/useFileChange/useFileChange';

import { useRouter } from 'next/navigation';

export default function OrgSignInForm() {
  const router = useRouter();
  const { validFiles, handleFileChange } = useFileChange();

  return (
    <div className="@container mt-16 mb-8 flex h-auto w-11/12 flex-col items-center justify-center rounded-xl bg-white p-4 pt-8 pb-8 sm:w-5/6 sm:p-10 lg:w-1/2">
      <LogoWithText size="medium" />
      <h1 className="mt-4 text-center">Organization Sign Up</h1>
      <p className="mt-2 mb-8 text-center">
        Welcome to Flare! We're excited to have your organization join our vibrant community. Once
        you sign up, your account will be reviewed for verification to ensure a safe and authentic
        space for everyone. While you're pending approval, you can still create events—but they
        won’t be visible to the public until you're verified. Thanks for helping us keep Flare
        inclusive and trustworthy!
      </p>
      <form className="w-full">
        <FormSection text="General Information">
          <div className="flex flex-col gap-4">
            <HeroInput label="Organization Name" name="orgName" />
            <HeroInput label="Organization Email" name="email" />
            <PlaceSearch lab="Location" />
            <HeroInput label="Choose Password" name="password" type="password" />
            <HeroInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              errorMessage={'Passwords Must Match'}
            />
          </div>
        </FormSection>
        <FormSection
          text="Proof of Ownership"
          blurb="To help us verify your organization, you can optionally provide your social media handles (Instagram, Facebook, or Twitter/X) along with an image that proves you have access to the account. This speeds up the review process and helps us confirm you're representing a legitimate group. Examples of valid proof include: a screenshot showing you're logged into the account, screenshot of your profile settings or admin dashboard, recent post clearly showing your organization’s name or branding. This information stays private and is only used for verification purposes."
        >
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
        <PrimaryButton type="submit" />
      </form>
    </div>
  );
}
