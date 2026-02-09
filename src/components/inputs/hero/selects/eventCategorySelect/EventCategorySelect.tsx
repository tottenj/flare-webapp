import HeroSelect from '@/components/inputs/hero/selects/HeroSelect';
import EventCategorySelectItem from '@/components/inputs/hero/selects/Items/EventCategorySelectItem';
import { EVENT_CATEGORIES, EventCategory } from '@/lib/types/EventCategory';
import { SelectedItems } from '@heroui/react';

export default function EventCategorySelect({required}: {required?:boolean}) {
  type EventCategoryItem = (typeof EVENT_CATEGORIES)[number];

  return (
    <HeroSelect<EventCategoryItem>
      items={EVENT_CATEGORIES}
      defaultSelectedKeys={[EVENT_CATEGORIES[0].key]}
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
