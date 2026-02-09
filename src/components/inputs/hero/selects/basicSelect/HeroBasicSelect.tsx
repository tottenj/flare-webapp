import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';
import BasicSelectItem from '@/components/inputs/hero/selects/Items/basicSelectItem/BasicSelectItem';

type BasicOption = {
  label: string;
  value: string;
};

interface HeroBasicSelectProps<T extends BasicOption> {
  items: readonly T[];
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}

export default function HeroBasicSelect<T extends BasicOption>({
  items,
  name,
  label,
  required,
  defaultValue,
}: HeroBasicSelectProps<T>) {
  return (
    <HeroSelect<T>
      items={items}
      name={name}
      label={label}
      required={required}
      defaultSelectedKeys={[defaultValue ?? items[0].value]}
    >
      {items.map((opt) => (
        <HeroSelect.Item key={opt.value} textValue={opt.label}>
          <BasicSelectItem label={opt.label} />
        </HeroSelect.Item>
      ))}
    </HeroSelect>
  );
}
