'use client';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import HeroFieldset from '@/components/forms/hero/fieldset/HeroFieldset';
import HeroForm from '@/components/forms/hero/form/HeroForm';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import HeroCard from '@/components/ui/HeroCard/HeroCard';

export default function OrganizationForm() {
  return (
    <HeroCard className="w-full border-2 p-8">
      <HeroForm>
        <HeroFieldset className="w-full gap-8">
          <HeroFieldset.Group>
            <HeroInput
              label="Organization Name"
              description="Use the name people know your organization by."
              variant="secondary"
            />
            <PlaceSearch description="Home location of your organization" onChange={() => {}}/>
          </HeroFieldset.Group>
          <HeroFieldset.Actions>
            <HeroButton type="submit">Create Organization</HeroButton>
          </HeroFieldset.Actions>
        </HeroFieldset>
      </HeroForm>
    </HeroCard>
  );
}
