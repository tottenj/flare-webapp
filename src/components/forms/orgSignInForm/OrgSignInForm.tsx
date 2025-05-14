'use client';

import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import TextInput from '@/components/inputs/textInput/TextInput';
import Location from '@/lib/types/Location';

export default function OrgSignInForm() {
  const handlePlaceSelected = (place:Location) => console.log(place);


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
      <form className="w-full">
        <div className="flex justify-between mt-4">
          <TextInput label="Organization Name" name="orgName" size="Double" />
          <TextInput label="Organization Email" name="orgEmail" size="Double" />
        </div>
        <TextInput label="Choose Password" name="orgPassword" size="XLarge" />
        <div className="flex justify-between mt-8">
          <TextInput label="Instagram" name="instagram" size="Small" />
          <TextInput label="Facebook" name="facebook" size="Small" />
          <TextInput label="Twitter" name="twitter" size="Small" />
        </div>
   <PlaceSearch/>
      </form>
    </div>
  );
}
