'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function useQueryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = Object.fromEntries(searchParams);
  
  function setFilters(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  }
  return {
    filters,
    setFilters,
  };
}
