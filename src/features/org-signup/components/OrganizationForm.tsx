'use client';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import HeroFieldset from '@/components/forms/hero/fieldset/HeroFieldset';
import HeroForm from '@/components/forms/hero/form/HeroForm';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import HeroCard from '@/components/ui/HeroCard/HeroCard';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import HeroSeparator from '@/components/ui/HeroSeparator/HeroSeparator';
import HeroProgressBar from '@/components/ui/HeroProgressBar/HeroProgressBar';

export default function OrganizationForm() {
  return (
    <HeroCard className="w-full border-2 p-8">
      <HeroForm className="flex flex-col gap-8">
        <div className='flex flex-col gap-2'>
          <p className="text-muted">Step 1 of 3</p>
          <HeroProgressBar value={1} maxValue={3}  />
        </div>
        <HeroFieldset className="w-full">
          <HeroFieldset.Group className="flex flex-col gap-2">
            <HeroInput label="Organization Name" variant="secondary" />
            <PlaceSearch description="Home location of your organization" onChange={() => {}} />
            <HeroTextArea
              label="Tell us about your organization"
              description="Provide a brief description of your organization."
              variant="secondary"
            />
          </HeroFieldset.Group>
          <HeroFieldset.Actions>
            <HeroButton type="submit">Create Organization</HeroButton>
          </HeroFieldset.Actions>
        </HeroFieldset>
      </HeroForm>
    </HeroCard>
  );
}
