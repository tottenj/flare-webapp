'use client';

import { Input } from '@heroui/react';
import { useId, type ComponentProps } from 'react';

import Label from '../label/Label';

export type HeroFileProps = Omit<ComponentProps<typeof Input>, 'type'> & {
  label: string;
};

export default function HeroFile({ label, id, name, className, ...props }: HeroFileProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        {...props}
        id={inputId}
        name={name}
        type="file"
        fullWidth
        className={`file:bg-default file:text-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:px-3 file:py-1 file:text-sm file:font-medium ${className ?? ''}`}
        data-cy={`${name ?? 'file'}-input`}
      />
    </div>
  );
}
