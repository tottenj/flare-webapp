import HeroBasicSelect, {
  BasicSelectExtender,
} from '@/components/inputs/hero/selects/basicSelect/HeroBasicSelect';
import { AGE_RANGE_OPTIONS } from '@/lib/types/AgeRange';

export default function AgeRestrictionSelect({
  required,
  defaultValue,
}: BasicSelectExtender<any> & { defaultValue?: string }) {
  return (
    <HeroBasicSelect
      items={AGE_RANGE_OPTIONS}
      name="ageRestriction"
      label="Age Restriction"
      required={required}
      defaultValue={defaultValue}
    />
  );
}
