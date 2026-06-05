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

  const selected = filters[param] ?? defaultValue;

  return (
    <Tabs
      onSelectionChange={(key) =>
        setFilters({ [param]: String(key) } as Partial<Record<T, string | null>>)
      }
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
