'use client';
import { useState, type FormEvent } from 'react';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import HeroFieldset from '@/components/forms/hero/fieldset/HeroFieldset';
import HeroForm from '@/components/forms/hero/form/HeroForm';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import HeroCard from '@/components/ui/HeroCard/HeroCard';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import HeroProgressBar from '@/components/ui/HeroProgressBar/HeroProgressBar';
import { orgSocialProofSchema } from '../schemas/orgCreateSchema';
import SocialProof, { type SocialProofProps } from './SocialProof';

export default function OrganizationForm() {
  const [step, setStep] = useState(1);
  const [socialProofErrors, setSocialProofErrors] = useState<SocialProofProps['errors']>();
  const isFirstStep = step === 1;
  const isLastStep = step === 3;

  const titles: Record<number, string> = {1: 'Organization Details', 2: 'Contact Information', 3: 'Social Proof'};
  const title = titles[step];

 

  return (
    <HeroCard className="w-full border-2 p-8">
      <HeroForm className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <h2 className="font-heading font-bold">{title}</h2>
            <p className="text-muted text-sm">Step {step} of 3</p>
          </div>
          <HeroProgressBar value={step} maxValue={3} />
        </div>
        {step === 1 && (
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
          </HeroFieldset>
        )}
        {step === 2 && (
          <HeroFieldset>
            <HeroFieldset.Group className="flex flex-col gap-2">
              <HeroInput type="email" label="Organization Email" variant="secondary" />
              <HeroInput type="tel" label="Organization Phone" variant="secondary" />
              <HeroInput type="url" label="Organization Website" variant="secondary" />
            </HeroFieldset.Group>
          </HeroFieldset>
        )}

        <div hidden={step !== 3}>
          <HeroFieldset>
            <HeroFieldset.Group className="flex flex-col gap-2">
              <SocialProof errors={socialProofErrors} />
            </HeroFieldset.Group>
          </HeroFieldset>
        </div>

        <HeroFieldset.Actions>
          {!isFirstStep && (
            <HeroButton
              type="button"
              variant="secondary"
              onPress={() => setStep((prev) => prev - 1)}
            >
              Back
            </HeroButton>
          )}
          {!isLastStep && (
            <HeroButton type="button" onPress={() => setStep((prev) => prev + 1)}>
              Next
            </HeroButton>
          )}
          {isLastStep && <HeroButton type="submit">Submit</HeroButton>}
        </HeroFieldset.Actions>
      </HeroForm>
    </HeroCard>
  );
}
