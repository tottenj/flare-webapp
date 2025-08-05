// src/components/buttons/ClearFiltersButton.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Chip } from '@heroui/react';
import FilterToggles from '../filterToggles/FilterToggles';

export default function ClearFiltersButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Define which filter keys to delete
    const keysToDelete = ['onDate','date', 'type', 'category', 'location', 'lat', 'lng', 'radius', 'age', 'location']; // adjust based on your filters

    keysToDelete.forEach((key) => {
      params.delete(key);
    });

    router.replace(`?${params.toString()}`);
  };

  return (
    <Chip color='danger' onClose={() => handleClear()}>Clear All</Chip>
  );
}
