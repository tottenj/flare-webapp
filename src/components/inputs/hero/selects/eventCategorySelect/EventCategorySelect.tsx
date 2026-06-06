import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';
import EventCategorySelectItem from '@/components/inputs/hero/selects/Items/eventCategorySelectItem/EventCategorySelectItem';
import { EVENT_CATEGORIES, EventCategory } from '@/lib/types/EventCategory';
import { SharedSelection } from '@heroui/react';
import { SelectedItems } from '@heroui/react';

export default function EventCategorySelect({
  required,
  defaultValue,
  selectedKey,
  onSelectionChange,
}: {
  required?: boolean;
  defaultValue?: EventCategory;
  selectedKey?: EventCategory;
  onSelectionChange?: (key: SharedSelection) => void;
}) {
  type EventCategoryItem = (typeof EVENT_CATEGORIES)[number];
  const initialValue = defaultValue ?? (required ? EVENT_CATEGORIES[0].key : undefined);
  const isControlled = selectedKey !== undefined;

  return (
    <HeroSelect<EventCategoryItem>
      name="category"
      items={EVENT_CATEGORIES}
      defaultSelectedKeys={initialValue ? [initialValue] : undefined}
      selectedKeys={isControlled ? [selectedKey] : undefined}
      onSelectionChange={onSelectionChange}
      required={required}
      label="Event Category"
      renderValue={(items: SelectedItems<EventCategoryItem>) => {
        return items.map((item) => (
          <EventCategorySelectItem key={item.key} category={item.key as EventCategory} />
        ));
      }}
    >
      {EVENT_CATEGORIES.map((category) => (
        <HeroSelect.Item key={category.key} textValue={category.label}>
          <EventCategorySelectItem category={category.key} />
        </HeroSelect.Item>
      ))}
    </HeroSelect>
  );
}
