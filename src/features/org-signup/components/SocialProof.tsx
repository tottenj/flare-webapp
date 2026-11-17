import { FieldError, Label, ListBox, Select } from '@heroui/react';
import { useState } from 'react';
import HeroFile, { type HeroFileProps } from '@/components/inputs/hero/file/HeroFile';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import { SOCIAL_CONFIG, type FileKey, type SocialPlatform } from '@/lib/utils/socialConfig';

export type SocialProofProps = {
  onChange?: HeroFileProps['onChange'];
  errors?: {
    socialProofType?: string[];
    socialProofDetails?: string[];
    socialProofFile?: string[];
  };
};

const options = [
  ...(Object.keys(SOCIAL_CONFIG) as SocialPlatform[]).map((value) => ({
    value,
    label: SOCIAL_CONFIG[value].label,
  })),
  { value: 'other' as const, label: 'Other' },
];

export default function SocialProof({ onChange, errors }: SocialProofProps) {
  const [platform, setPlatform] = useState<FileKey>('twitter');
  const config = platform === 'other' ? null : SOCIAL_CONFIG[platform];

  return (
    <div className="flex flex-col gap-3">
      <Select
        name="socialProofType"
        value={platform}
        onChange={(value) => {
          const option = options.find((item) => item.value === value);
          if (option) setPlatform(option.value);
        }}
        isInvalid={!!errors?.socialProofType?.length}
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
        <FieldError>{errors?.socialProofType?.[0]}</FieldError>
      </Select>
      <HeroInput
        label={config ? `${config.label} Handle` : 'Proof description'}
        name="socialProofDetails"
        placeholder={config?.placeholder}
        errorMessage={errors?.socialProofDetails?.[0]}
        variant="secondary"
      />
      <HeroFile
        label="Proof file"
        name="socialProofFile"
        onChange={onChange}
        aria-invalid={!!errors?.socialProofFile?.length}
      />
      {errors?.socialProofFile?.[0] && (
        <p role="alert" className="text-danger text-sm">
          {errors.socialProofFile[0]}
        </p>
      )}
    </div>
  );
}
