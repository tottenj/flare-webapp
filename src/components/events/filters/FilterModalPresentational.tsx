'use client';

import { useEffect, useState } from 'react';
import EventCategorySelect from '@/components/inputs/hero/selects/eventCategorySelect/EventCategorySelect';
import { EventCategory } from '#prisma/generated/enums';
import PlaceSearch from '@/components/inputs/placeSearch/PlaceSearch';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import HeroSlider from '@/components/inputs/hero/slider/HeroSlider';

interface FilterModalPresentationalProps {
  category?: EventCategory;
  location?: LocationInput;
  onCategoryChange: (value: EventCategory | null) => void;
  onLocationChange: (value: LocationInput | null) => void;
  onClear: () => void;
  distance?: number;
  onDistanceChange: (value: number | null) => void;
}

export default function FilterModalPresentational({
  category,
  location,
  distance,
  onCategoryChange,
  onLocationChange,
  onDistanceChange,
  onClear,
}: FilterModalPresentationalProps) {
  const [sliderValue, setSliderValue] = useState<number>(distance ?? 10);

  useEffect(() => {
    setSliderValue(distance ?? 10);
  }, [distance]);

  return (
    <div className="flex flex-col gap-8">
      <h2>Event Filters</h2>

      <div data-cy="filter-category-select">
        <EventCategorySelect
          required={false}
          selectedKey={category}
          onSelectionChange={(key) => {
            if (!key || key === 'all') {
              onCategoryChange(null);
              return;
            }

            const selected = Array.from(key as Set<React.Key>)[0];
            onCategoryChange(selected ? (String(selected) as EventCategory) : null);
          }}
        />
      </div>

      <div className="flex flex-col">
        <PlaceSearch
          required={false}
          label="Location"
          value={location}
          onChange={(nextLocation) => onLocationChange(nextLocation)}
        />

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Distance</span>
            <span>{sliderValue} km</span>
          </div>

          <HeroSlider
            value={sliderValue}
            isDisabled={!location}
            onChange={(value) => {
              const nextDistance = Array.isArray(value) ? value[0] : value;
              if (typeof nextDistance === 'number') {
                setSliderValue(nextDistance);
              }
            }}
            onChangeEnd={(value) => {
              if (!location) return;
              const nextDistance = Array.isArray(value) ? value[0] : value;
              onDistanceChange(typeof nextDistance === 'number' ? nextDistance : null);
            }}
            getValue={(val) => `${val} km`}
            formatOptions={{ style: 'decimal' }}
            minValue={10}
            maxValue={100}
            step={1}
            showTooltip
          />

          {!location && (
            <p className="text-default-500 text-xs">Pick a location to enable distance.</p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="self-start rounded-2xl border px-4 py-2 text-sm"
        onClick={onClear}
      >
        Clear Filters
      </button>
    </div>
  );
}
