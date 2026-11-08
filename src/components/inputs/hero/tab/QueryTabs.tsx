'use client';

import useQueryFilters from '@/lib/hooks/useQueryFilters';

interface TabOption {
  key: string;
  label: string;
}

interface QueryTabProps<T extends string> {
  param: T;
  defaultValue: string;
  tabs: TabOption[];
  color?: string;
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
    <div role="tablist" className="flex w-full gap-2">
      {tabs.map((tab) => (
        <button
          type="button"
          role="tab"
          aria-selected={selected === tab.key}
          data-cy={`tab-${tab.key}`}
          key={tab.key}
          className="rounded-full border px-4 py-2"
          onClick={() => {
            const updates: Parameters<typeof setFilters>[0] = {
              [param]: tab.key,
            } as Parameters<typeof setFilters>[0];
            setFilters(updates);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
