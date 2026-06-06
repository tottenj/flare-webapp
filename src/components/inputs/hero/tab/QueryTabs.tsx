'use client';

import useQueryFilters from '@/lib/hooks/useQueryFilters';
import { Tab, Tabs, TabsProps } from '@heroui/tabs';

interface TabOption {
  key: string;
  label: string;
}

interface QueryTabProps<T extends string> extends TabsProps {
  param: T;
  defaultValue: string;
  tabs: TabOption[];
}

export default function QueryTabs<T extends string>({
  tabs,
  param,
  defaultValue,
  ...props
}: QueryTabProps<T>) {
  const { filters, setFilters } = useQueryFilters<T>();
  const queryParam = param as keyof typeof filters;

  const selected = filters[queryParam] ?? defaultValue;

  return (
    <Tabs
      onSelectionChange={(key) => {
        const updates: Parameters<typeof setFilters>[0] = {
          [param]: String(key),
        } as Parameters<typeof setFilters>[0];
        setFilters(updates);
      }}
      selectedKey={selected}
      classNames={{
        base: 'w-full',
        tabList: 'w-full',
      }}
      {...props}
    >
      {tabs.map((tab) => (
        <Tab data-cy={`tab-${tab.key}`} key={tab.key} title={tab.label} />
      ))}
    </Tabs>
  );
}
