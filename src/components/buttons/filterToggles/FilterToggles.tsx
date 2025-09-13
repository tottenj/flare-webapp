'use client';
import { useRouter, useSearchParams } from 'next/navigation';

type FilterKey = string;

interface FilterToggleConfig {
  label: (value: string) => string;
  colorClass: string;
}

const FILTER_CONFIG: Record<FilterKey, FilterToggleConfig> = {
  date: {
    label: (value) => `Date: ${value}`,
    colorClass: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  },
  type: {
    label: (value) => `Type: ${value}`,
    colorClass: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  },

  age: {
    label: (value) => `Age: ${value}`,
    colorClass: 'bg-green',
  },

  location:{
    label: (value) => `Location ${value}`,
    colorClass: `bg-yellow`
  }
};

export default function FilterToggles() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const activeFilters: { key: FilterKey; value: string; config: FilterToggleConfig }[] = [];

  for (const [key, config] of Object.entries(FILTER_CONFIG)) {
    const value = searchParams.get(key);
    if (!value) continue;

    if (key === 'age' || key === 'type') {
      const values = value.split(',');
      values.forEach((val) => {
        activeFilters.push({ key, value: val, config });
      });
    } else {
      activeFilters.push({ key, value, config });
    }
  }

  const handleRemove = (key: FilterKey, valueToRemove: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (key === 'type' || key === 'age') {
      const currentValues = newParams.get(key)?.split(',') ?? [];
      const filteredValues = currentValues.filter((v) => v !== valueToRemove);
      if (filteredValues.length === 0) {
        newParams.delete(key);
      } else {
        newParams.set(key, filteredValues.join(','));
      }
    } else if (key == 'location'){
      newParams.delete('location')
      newParams.delete('lat')
      newParams.delete('lng')
      newParams.delete('radius')
    }
    else {
      newParams.delete(key);
    }

    router.push('?' + newParams.toString());
  };

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-1 flex flex-wrap gap-2 self-end">
      {activeFilters.map(({ key, value, config }) => (
        <button
          key={`${key}-${value}`}
          onClick={() => handleRemove(key, value)}
          className={`rounded-full px-3 py-1 text-sm ${config.colorClass}`}
          aria-label={`Remove filter ${key} ${value}`}
          type="button"
        >
          {config.label(value)} &times;
        </button>
      ))}
    </div>
  );
}
