'use client';

import { Label, ListBox } from '@heroui/react';
import HeroUISelect from '@/components/ui/HeroUISelect/HeroUISelect';
import {
  OrganizationTypeSchema,
  type OrganizationTypeValue,
} from '@/lib/schemas/org/OrganizationTypeSchema';
import { ORGANIZATION_TYPE_OPTIONS } from '@/lib/types/OrganizationType';

export default function OrganizationTypeSelect({
  required,
  value,
  defaultValue,
  onChange,
}: {
  required?: boolean;
  value?: OrganizationTypeValue | null;
  defaultValue?: OrganizationTypeValue;
  onChange?: (value: OrganizationTypeValue | null) => void;
}) {
  return (
    <HeroUISelect
      name="organizationType"
      fullWidth
      isRequired={required}
      value={value}
      defaultValue={defaultValue}
      placeholder="Select organization type"
      onChange={(key) => {
        const result = OrganizationTypeSchema.safeParse(key);
        onChange?.(result.success ? result.data : null);
      }}
    >
      <Label>Organization type</Label>
      <HeroUISelect.Trigger>
        <HeroUISelect.Value />
        <HeroUISelect.Indicator />
      </HeroUISelect.Trigger>
      <HeroUISelect.Popover>
        <ListBox>
          {ORGANIZATION_TYPE_OPTIONS.map((option) => (
            <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </HeroUISelect.Popover>
    </HeroUISelect>
  );
}
