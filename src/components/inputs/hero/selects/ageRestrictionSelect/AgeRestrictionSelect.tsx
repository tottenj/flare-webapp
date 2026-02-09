import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';
import AgeRestrictionItem from '@/components/inputs/hero/selects/Items/ageRestrictionItem/AgeRestrictionItem';
import { AGE_RANGE_OPTIONS } from '@/lib/types/AgeRange';


export default function AgeRestrictionSelect({ required }: { required?: boolean }) {
  type AgeRestrictionItemType = (typeof AGE_RANGE_OPTIONS)[number];

  return (
    <HeroSelect<AgeRestrictionItemType>
      items={AGE_RANGE_OPTIONS}
      defaultSelectedKeys={[AGE_RANGE_OPTIONS[0].value]}
      required={required}
      name='ageRestriction'
      label="Age Restriction"
    >
      {AGE_RANGE_OPTIONS.map((opt) => (
        <HeroSelect.Item key={opt.value} textValue={opt.label}>
          <AgeRestrictionItem label={opt.label} />
        </HeroSelect.Item>
      ))}
    </HeroSelect>
  );
}
