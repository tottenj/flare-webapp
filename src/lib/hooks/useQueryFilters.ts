'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type FilterType = string | Record<string, unknown>;
type FilterKey<T extends FilterType> = T extends string ? T : Extract<keyof T, string>;
type QueryFilterMap<T extends FilterType> = Partial<Record<FilterKey<T>, string>>;
type QueryFilterUpdates<T extends FilterType> = Partial<Record<FilterKey<T>, string | null>>;

export default function useQueryFilters<T extends FilterType = string>() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const filters = Object.fromEntries(searchParams) as QueryFilterMap<T>;

  function setFilters(updates: QueryFilterUpdates<T>) {
    const params = new URLSearchParams(searchParams);
    (Object.entries(updates) as [string, string | null | undefined][]).forEach(([key, value]) => {
      if (value == null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    router.replace(pathName, { scroll: false });
  }

  return {
    filters,
    setFilters,
    clearFilters,
  };
}
