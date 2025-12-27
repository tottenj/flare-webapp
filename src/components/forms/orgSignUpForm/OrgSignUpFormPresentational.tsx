'use client';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import FileInput from '@/components/inputs/file/FileInput';
import FormSection from '@/components/inputs/formSection/FormSection';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import useFileChange from '@/lib/hooks/useFileChange/useFileChange';

export default function OrgSignUpFormPresentational() {
  const { validFiles, handleFileChange } = useFileChange();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl bg-white p-4 shadow-2xl md:w-1/2 lg:w-2/5">
      <LogoWithText size="medium" />
      <h1 className="mt-4 mb-4 text-4xl">Become a Flare</h1>
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
