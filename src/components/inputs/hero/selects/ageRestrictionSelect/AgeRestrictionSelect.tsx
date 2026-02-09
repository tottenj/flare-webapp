import HeroBasicSelect from '@/components/inputs/hero/selects/basicSelect/HeroBasicSelect';
import { AGE_RANGE_OPTIONS } from '@/lib/types/AgeRange';

export default function AgeRestrictionSelect({ required }: { required?: boolean }) {
  return (
    <HeroBasicSelect
      items={AGE_RANGE_OPTIONS}
      name="ageRestriction"
      label="Age Restriction"
      required={required}
    />
  );
}
