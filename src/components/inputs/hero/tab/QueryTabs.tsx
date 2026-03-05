'use client';

import useQueryFilters from '@/lib/hooks/useQueryFilters';
import { Tab, Tabs, TabsProps } from '@heroui/tabs';

interface TabOption {
  key: string;
  label: string;
}

interface QueryTabProps extends TabsProps {
  param: string;
  defaultValue: string;
  tabs: TabOption[];
}

export default function QueryTabs({ tabs, param, defaultValue, ...props }: QueryTabProps) {
  const { filters, setFilters } = useQueryFilters();

  const selected = filters[param] ?? defaultValue;

  return (
    <Tabs
      onSelectionChange={(key) => setFilters({ [param]: String(key) })}
      selectedKey={selected}
      classNames={{
        'base': "w-full",
        'tabList': "w-full"
      }}
      {...props}
    >
      {tabs.map((tab) => (
        <Tab data-cy={`tab-${tab.key}`} key={tab.key} title={tab.label} />
      ))}
    </Tabs>
  );
}
