'use client';
import { useEffect, useState } from 'react';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import HeroFieldset from '@/components/forms/hero/fieldset/HeroFieldset';
import HeroForm from '@/components/forms/hero/form/HeroForm';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import HeroCard from '@/components/ui/HeroCard/HeroCard';
import HeroTextArea from '@/components/inputs/hero/textArea/HeroTextArea';
import HeroProgressBar from '@/components/ui/HeroProgressBar/HeroProgressBar';
import SocialProof from './SocialProof';
import submitOrgSignup from '../actions/submitOrgSignup';
import { useStateMachine } from 'little-state-machine';
import { clearDraft, saveDraft } from '../schemas/orgCreateStateMachine';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  firstStepWith,
  isOrgCreateField,
  orgCreateSchema,
  orgCreateValues,
  steps,
} from '../schemas/orgCreateSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormAction } from '@/lib/hooks/useFormAction';

function toFormData(values: orgCreateValues): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value instanceof File) {
      formData.set(key, value);
    } else if (value != null) {
      formData.set(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }

  return formData;
}

export default function OrganizationForm() {
  const [step, setStep] = useState(0);
  const isLastStep = step === steps.length - 1;

  const titles: Record<number, string> = {
    0: 'Organization Details',
    1: 'Contact Information',
    2: 'Social Proof',
  };
  const title = titles[step];

  const { actions, state } = useStateMachine({
    actions: {
      saveDraft,
      clearDraft,
    },
  });

  const methods = useForm<orgCreateValues>({
    resolver: zodResolver(orgCreateSchema),
    defaultValues: state.orgSignUpDraft,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    trigger,
    setError,
    subscribe,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        actions.saveDraft({ ...values, socialProofFile: undefined }, { skipRender: true });
      },
    });

    return unsubscribe;
  }, [subscribe, actions]);

  const goToFirstError = (names: string[]) => {
    const index = firstStepWith(names);
    if (index !== -1) setStep(index);
  };

  const { action, pending, error } = useFormAction(submitOrgSignup, {
    onError: (actionError) => {
      const fieldErrors = actionError.fieldErrors;
      if (!fieldErrors) return;

      for (const [name, messages] of Object.entries(fieldErrors)) {
        if (isOrgCreateField(name) && messages[0]) {
          setError(name, { type: 'server', message: messages[0] });
        }
      }
      goToFirstError(Object.keys(fieldErrors));
    },
  });

  const next = async () => {
    const isValid = await trigger(steps[step].fields, {
      shouldFocus: true,
    });

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <HeroCard className="w-full border-2 p-8">
      <FormProvider {...methods}>
        <HeroForm
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(
            (values) => action(toFormData(values)),
            (formErrors) => goToFirstError(Object.keys(formErrors))
          )}
        >
          {error && !error.fieldErrors && (
            <p role="alert" className="text-danger text-sm">
              {error.message}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <h2 className="font-heading font-bold">{title}</h2>
              <p className="text-muted text-sm">Step {step + 1} of 3</p>
            </div>
            <HeroProgressBar value={step} maxValue={3} />
          </div>
          {step === 0 && (
            <HeroFieldset className="w-full">
              <HeroFieldset.Group className="flex flex-col gap-2">
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <HeroInput
                      {...field}
                      label="Organization Name"
                      variant="secondary"
                      isInvalid={fieldState.invalid}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="location"
                  control={methods.control}
                  render={({ field }) => (
                    <PlaceSearch
                      required={false}
                      description="Home location of your organization"
                      value={field.value ?? null}
                      onChange={field.onChange}
                      onClear={() => field.onChange(undefined)}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <HeroTextArea
                      {...field}
                      value={field.value}
                      label="Tell us about your organization"
                      description="Provide a brief description of your organization."
                      variant="secondary"
                      isInvalid={fieldState.invalid}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
              </HeroFieldset.Group>
            </HeroFieldset>
          )}
          {step === 1 && (
            <HeroFieldset>
              <HeroFieldset.Group className="flex flex-col gap-2">
                <Controller
                  name="email"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <HeroInput
                      {...field}
                      value={field.value}
                      type="email"
                      label="Organization Email"
                      variant="secondary"
                      isInvalid={fieldState.invalid}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <HeroInput
                      {...field}
                      value={field.value}
                      type="tel"
                      label="Organization Phone"
                      variant="secondary"
                      isInvalid={fieldState.invalid}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="website"
                  control={methods.control}
                  render={({ field, fieldState }) => (
                    <HeroInput
                      {...field}
                      value={field.value}
                      type="url"
                      label="Organization Website"
                      variant="secondary"
                      isInvalid={fieldState.invalid}
                      errorMessage={fieldState.error?.message}
                      required={false}
                    />
                  )}
                />
              </HeroFieldset.Group>
            </HeroFieldset>
          )}

          <div hidden={step !== 2}>
            <HeroFieldset>
              <HeroFieldset.Group className="flex flex-col gap-2">
                <SocialProof />
              </HeroFieldset.Group>
            </HeroFieldset>
          </div>

          <HeroFieldset.Actions>
            {step !== 0 && (
              <HeroButton
                type="button"
                variant="secondary"
                onPress={() => setStep((prev) => prev - 1)}
              >
                Back
              </HeroButton>
            )}
            {!isLastStep && step !== 2 && (
              <HeroButton type="button" onPress={next}>
                Next
              </HeroButton>
            )}
            {isLastStep && (
              <HeroButton isDisabled={isSubmitting || pending} type="submit">
                Submit
              </HeroButton>
            )}
          </HeroFieldset.Actions>
        </HeroForm>
      </FormProvider>
    </HeroCard>
  );
}
