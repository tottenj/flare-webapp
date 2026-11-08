import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';

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
      name={name}
      label={label}
      data-cy={`${name}-input`}
      required={required}
      value={value === undefined ? undefined : String(value)}
      defaultValue={String(defaultValue ?? items[0]?.value ?? '')}
      onChange={(event) => {
        const selected = items.find((item) => String(item.value) === event.currentTarget.value);
        if (selected) onChange?.(selected.value);
      }}
    >
      {items.map((opt) => (
        <HeroSelect.Item key={String(opt.value)} value={String(opt.value)} textValue={opt.label}>
          {opt.label}
        </HeroSelect.Item>
      ))}
    </HeroSelect>
  );
}
