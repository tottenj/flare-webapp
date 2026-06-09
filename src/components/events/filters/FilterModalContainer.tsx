'use client';

import { useEffect, useState } from 'react';
import FilterModalPresentational from '@/components/events/filters/FilterModalPresentational';
import useQueryFilters from '@/lib/hooks/useQueryFilters';
import { EventCategory } from '#prisma/generated/enums';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { UserEventUrlFilter } from '@/lib/schemas/event/userEventUrlFilterSchema';
import { EventFilterDataDto } from '@/lib/types/dto/event/EventFilterDataDto';

export default function FilterModalContainer({ location }: EventFilterDataDto) {
  const { filters, setFilters, clearFilters } = useQueryFilters<UserEventUrlFilter>();

  const category = filters.category;
  const placeId = filters.placeId;
  const distance = filters.distance;

  const selectedCategory = Object.values(EventCategory).includes(category as EventCategory)
    ? (category as EventCategory)
    : undefined;

  const serverSelectedLocation = location && placeId === location.placeId ? location : undefined;
  const [selectedLocation, setSelectedLocation] = useState<LocationInput | undefined>(
    serverSelectedLocation ?? undefined
  );

  useEffect(() => {
    if (!placeId) {
      setSelectedLocation(undefined);
      return;
    }

    if (serverSelectedLocation) {
      setSelectedLocation(serverSelectedLocation);
    }
  }, [placeId, serverSelectedLocation]);

  const parsedDistance = distance != null ? Number(distance) : undefined;
  const selectedDistance =
    parsedDistance != null && Number.isFinite(parsedDistance) ? parsedDistance : undefined;

  return (
    <FilterModalPresentational
      category={selectedCategory}
      location={selectedLocation}
      distance={selectedDistance}
      onCategoryChange={(nextCategory) =>
        setFilters({
          category: nextCategory,
        })
      }
      onLocationChange={(nextLocation) => {
        setSelectedLocation(nextLocation ?? undefined);
        setFilters({
          placeId: nextLocation?.placeId ?? null,
        });
      }}
      onDistanceChange={(nextDistance) =>
        setFilters({
          distance: nextDistance == null ? null : String(nextDistance),
        })
      }
      onClear={clearFilters}
    />
  );
}
