'use client';

import { useEffect, useState } from 'react';
import { useAsyncList } from '@react-stately/data';
import type { ReactNode } from 'react';
import type { LocationInput } from '@/lib/schemas/LocationInputSchema';
import HeroAutocomplete, {
  type HeroAutocompleteOption,
} from '@/components/inputs/hero/autocomplete/HeroAutocomplete';

interface PlaceOption {
  label: string;
  value: string;
}

type GetPlaces = typeof import('@/lib/utils/places/getPlaces/getPlaces').default;
type GetPlaceDetails =
  typeof import('@/lib/utils/places/getPlaceDetails/getPlaceDetails').getPlaceDetails;

interface PlaceSearchProps {
  label?: string;
  description?: ReactNode;
  required?: boolean;
  z?: string;
  value?: LocationInput | null;
  onChange: (location: LocationInput) => void;
}

export default function PlaceSearch({
  label,
  description,
  required = true,
  z,
  value,
  onChange,
}: PlaceSearchProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [getPlaces, setGetPlaces] = useState<GetPlaces | null>(null);
  const [getPlaceDetails, setGetPlaceDetails] = useState<GetPlaceDetails | null>(null);
  const [locationSelect, setLocationSelect] = useState<LocationInput | null>(value ?? null);
  const [selectedKey, setSelectedKey] = useState<string | null>(
    value ? JSON.stringify(value) : null
  );
  const [selectedLabel, setSelectedLabel] = useState<string>(value?.address ?? '');

  const list = useAsyncList<PlaceOption>({
    async load({ filterText }) {
      if (!getPlaces || !filterText) return { items: [] };
      const requestId = Date.now();
      return {
        items: await getPlaces(
          filterText,
          requestId,
          requestId,
          userLocation?.lat,
          userLocation?.lng
        ),
      };
    },
  });

  // Get user location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation failed or denied', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const loadModules = async () => {
      if (process.env.NEXT_PUBLIC_USE_PLACES_MOCK === 'true') {
        const mock = await import('@/lib/utils/places/getPlaceDetails/mock/getPlaceDetailsMock');
        setGetPlaces(() => mock.getPlaces);
        setGetPlaceDetails(() => mock.getPlaceDetails);
      } else {
        const real = await import('@/lib/utils/places/getPlaces/getPlaces');
        const details = await import('@/lib/utils/places/getPlaceDetails/getPlaceDetails');
        setGetPlaces(() => real.default);
        setGetPlaceDetails(() => details.getPlaceDetails);
      }
    };
    loadModules();
  }, []);

  useEffect(() => {
    if (value) {
      setLocationSelect(value);
      setSelectedKey(JSON.stringify(value));
      setSelectedLabel(value.address);
      list.setFilterText(value.address);
      return;
    }

    setLocationSelect(null);
    setSelectedKey(null);
    setSelectedLabel('');
    list.setFilterText('');
  }, [value]);

  function handleSearchValueChange(searchValue: string) {
    list.setFilterText(searchValue);
    if (searchValue !== selectedLabel) {
      setLocationSelect(null);
      setSelectedKey(null);
      setSelectedLabel('');
    }
  }

  async function handleSelection(key: string | null) {
    if (!key) {
      setLocationSelect(null);
      setSelectedKey(null);
      setSelectedLabel('');
      return;
    }

    if (locationSelect && key === JSON.stringify(locationSelect)) return;
    if (!getPlaceDetails) return;
    const selected = list.items.find((item) => item.value === key);
    if (!selected) return;

    setSelectedKey(selected.value);
    setSelectedLabel(selected.label);
    list.setFilterText(selected.label);

    const place = await getPlaceDetails(selected.value);
    if (!place?.place.location) {
      setLocationSelect(null);
      setSelectedKey(null);
      setSelectedLabel('');
      return;
    }

    const location: LocationInput = {
      placeId: place.place.id,
      // Keep the selected suggestion text in the input for a stable UX.
      address: selected.label,
      lat: place.place.location.lat(),
      lng: place.place.location.lng(),
    };

    setLocationSelect(location);
    setSelectedKey(JSON.stringify(location));
    onChange(location);
  }

  const options: HeroAutocompleteOption[] = list.items.map((item) => ({
    id: item.value,
    label: item.label,
  }));
  if (selectedKey && !options.some((option) => option.id === selectedKey)) {
    options.unshift({
      id: selectedKey,
      label: locationSelect?.address ?? selectedLabel,
    });
  }

  return (
    <>
      <HeroAutocomplete
        label={label}
        name={locationSelect ? 'location' : undefined}
        placeholder="Type to search..."
        description={description}
        searchValue={list.filterText}
        selectedKey={selectedKey}
        options={options}
        required={required}
        isLoading={list.isLoading}
        onSearchValueChange={handleSearchValueChange}
        onSelectionChange={(key) => void handleSelection(key)}
      />
    </>
  );
}
