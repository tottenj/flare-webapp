import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';
import { EVENT_CATEGORIES, EventCategory } from '@/lib/types/EventCategory';

export default function EventCategorySelect({
  required,
  defaultValue,
  selectedKey,
  onChange,
}: {
  required?: boolean;
  defaultValue?: EventCategory;
  selectedKey?: EventCategory;
  onChange?: (key: EventCategory | null) => void;
}) {
  return (
    <HeroSelect
      name="category"
      required={required}
      value={selectedKey}
      defaultValue={
        selectedKey === undefined
          ? (defaultValue ?? (required ? EVENT_CATEGORIES[0].key : ''))
          : undefined
      }
      onChange={(event) => onChange?.((event.currentTarget.value || null) as EventCategory | null)}
      label="Event Category"
    >
      {!required && (
        <HeroSelect.Item value="" textValue="All categories">
          All categories
        </HeroSelect.Item>
      )}
      {EVENT_CATEGORIES.map((category) => (
        <HeroSelect.Item key={category.key} value={category.key} textValue={category.label}>
          {category.label}
        </HeroSelect.Item>
      ))}
    </HeroSelect>
  );
}
