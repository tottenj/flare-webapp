import { Form } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroFormProps = ComponentProps<typeof Form>;

export default function HeroForm(props: HeroFormProps) {
  return <Form {...props} />;
}
