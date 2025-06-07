// src/components/buttons/ClearFiltersButton.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import PrimaryButton from '../primaryButton/PrimaryButton';

export default function ClearFiltersButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClear = () => {
    console.log("LDSFK")
    const params = new URLSearchParams(searchParams.toString());

    // Define which filter keys to delete
    const keysToDelete = ['onDate','date', 'type', 'category', 'location', 'lat', 'lng', 'radius', 'age', 'location']; // adjust based on your filters

    keysToDelete.forEach((key) => {
      params.delete(key);
    });

    router.replace(`?${params.toString()}`);
  };

  return (
    <PrimaryButton styleOver={{marginBottom: "1rem", marginTop: "0"}} text='Clear All Filters' type='button' size='full' click={() => handleClear()} />
  );
}
