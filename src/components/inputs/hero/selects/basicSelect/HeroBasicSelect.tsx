import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';
import BasicSelectItem from '@/components/inputs/hero/selects/Items/basicSelectItem/BasicSelectItem';

type BasicOption<T> = {
  label: string;
  value: T;
};

export interface BasicSelectExtender<T> {
  required?: boolean;
  value?: T;
  onChange?: (val: T) => void;
}

interface HeroBasicSelectProps<T> extends BasicSelectExtender<T> {
  items: readonly BasicOption<T>[];
  name: string;
  label: string;
  defaultValue?: T;
}


export default function HeroBasicSelect<T>({
  items,
  name,
  label,
  required,
  value,
  defaultValue,
  onChange,
}: HeroBasicSelectProps<T>) {
  return (
    <HeroSelect
      items={items}
      name={name}
      label={label}
      required={required}
      selectedKeys={value ? [String(value)] : undefined}
      defaultSelectedKeys={!value ? [String(defaultValue ?? items[0].value)] : undefined}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0];
        if (selected && onChange) {
          onChange(selected as T);
        }
      }}
    >
      {items.map((opt) => (
        <HeroSelect.Item key={String(opt.value)} textValue={opt.label}>
          <BasicSelectItem label={opt.label} />
        </HeroSelect.Item>
      ))}
    </HeroSelect>
  );
}
