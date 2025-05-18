'use client';

import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import TextInput from '@/components/inputs/textInput/TextInput';
import orgSignUp from '@/lib/formActions/orgSignUp/orgSignUp';
import FlareLocation from '@/lib/types/Location';
import { useActionState, useState } from 'react';


export default function OrgSignInForm() {
  const [loc, setloc] = useState<FlareLocation | null>(null);
  const [state, action, pending] = useActionState(orgSignUp, null)
 

  return (
    <div className="@container flex w-5/6 flex-col items-center rounded-xl bg-white p-10 lg:w-1/2">
      <h1>Flare Sign Up</h1>
      <p className="mt-8 mb-8 text-center">
        Welcome to Flare! We're excited to have your organization join our vibrant community. Once
        you sign up, your account will be reviewed for verification to ensure a safe and authentic
        space for everyone. While you're pending approval, you can still create events—but they
        won’t be visible to the public until you're verified. Thanks for helping us keep Flare
        inclusive and trustworthy!
      </p>
      <form className="w-full" action={action.bind(loc)}>
        <div className="mt-4 flex justify-between">
          <TextInput label="Organization Name" name="orgName" size="Double" />
          <TextInput label="Organization Email" name="orgEmail" size="Double" />
        </div>
        <TextInput label="Choose Password" name="orgPassword" size="XLarge" />
        <div className="mt-8 flex justify-between">
          <TextInput label="Instagram" name="instagram" size="Small" />
          <TextInput label="Facebook" name="facebook" size="Small" />
          <TextInput label="Twitter" name="twitter" size="Small" />
        </div>
        <PlaceSearch loc={setloc} lab="Location" />
        {loc && <input type="hidden"  name="location" value={JSON.stringify(loc)} />}
        <PrimaryButton type="submit" />
      </form>
    </div>
  );
}
