import { Fieldset } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroFieldsetProps = ComponentProps<typeof Fieldset>;

function HeroFieldsetRoot(props: HeroFieldsetProps) {
  return <Fieldset {...props} />;
}

const HeroFieldset = Object.assign(HeroFieldsetRoot, {
  Legend: Fieldset.Legend,
  Group: Fieldset.Group,
  Actions: Fieldset.Actions,
});

export default HeroFieldset;
