'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type FilterType = string | Record<string, unknown>;
type FilterKey<T extends FilterType> = T extends string ? T : Extract<keyof T, string>;
type QueryFilterMap<T extends FilterType> = Partial<Record<FilterKey<T>, string>>;
type QueryFilterUpdates<T extends FilterType> = Partial<Record<FilterKey<T>, string | null>>;

export default function useQueryFilters<T extends FilterType = string>() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const paramsRef = useRef<URLSearchParams>(new URLSearchParams(searchParams.toString()));

  useEffect(() => {
    paramsRef.current = new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  const filters = Object.fromEntries(searchParams) as QueryFilterMap<T>;

  function setFilters(updates: QueryFilterUpdates<T>) {
    const params = new URLSearchParams(paramsRef.current.toString());
    (Object.entries(updates) as [string, string | null | undefined][]).forEach(([key, value]) => {
      if (value == null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    paramsRef.current = params;

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
