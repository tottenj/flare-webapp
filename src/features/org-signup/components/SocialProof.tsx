import { FieldError, Label, ListBox, Select } from '@heroui/react';
import { Controller, useFormContext } from 'react-hook-form';
import HeroFile from '@/components/inputs/hero/file/HeroFile';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import type { orgCreateValues } from '../schemas/orgCreateSchema';
import { SOCIAL_CONFIG, type FileKey, type SocialPlatform } from '@/lib/utils/socialConfig';

const options = [
  ...(Object.keys(SOCIAL_CONFIG) as SocialPlatform[]).map((value) => ({
    value,
    label: SOCIAL_CONFIG[value].label,
  })),
  { value: 'other' as const, label: 'Other' },
];

export default function SocialProof() {
  const { control, watch } = useFormContext<orgCreateValues>();
  const platform = (watch('socialProofType') ?? 'other') as FileKey;
  const config = platform === 'other' ? null : SOCIAL_CONFIG[platform];

  return (
    <div className="flex flex-col gap-3">
      <Controller
        name="socialProofType"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onChange={(value) => {
              const option = options.find((item) => item.value === value);
              if (option) field.onChange(option.value);
            }}
            isInvalid={fieldState.invalid}
            variant="secondary"
            fullWidth
          >
            <Label>Proof type</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {options.map((option) => (
                  <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Select>
        )}
      />
      <Controller
        name="socialProofDetails"
        control={control}
        render={({ field, fieldState }) => (
          <HeroInput
            {...field}
            value={field.value}
            label={config ? `${config.label} Handle` : 'Proof description'}
            placeholder={config?.placeholder}
            isInvalid={fieldState.invalid}
            errorMessage={fieldState.error?.message}
            variant="secondary"
          />
        )}
      />
      <Controller
        name="socialProofFile"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <HeroFile
              ref={field.ref}
              label="Proof file"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(event) => field.onChange(event.currentTarget.files?.[0])}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error?.message && (
              <p role="alert" className="text-danger text-sm">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
