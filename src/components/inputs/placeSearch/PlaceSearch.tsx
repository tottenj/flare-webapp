'use client';

import { useEffect, useState } from 'react';
import { useAsyncList } from '@react-stately/data';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';

interface placeOption {
  label: string;
  value: string;
}

interface placeSearchProps {
  label?: string;
  required?: boolean;
  z?: string;
  value?: LocationInput | null;
  onChange: (location: LocationInput) => void;
}

export default function PlaceSearch({
  label,
  required = true,
  z,
  value,
  onChange,
}: placeSearchProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [getPlaces, setGetPlaces] = useState<null | Function>(null);
  const [getPlaceDetails, setGetPlaceDetails] = useState<null | Function>(null);
  const [locationSelect, setLocationSelect] = useState<null | LocationInput>(value ?? null);
  const [selectedLabel, setSelectedLabel] = useState<string>(value?.address ?? '');

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
      setSelectedLabel(value.address);
      list.setFilterText(value.address);
      return;
    }

    setLocationSelect(null);
    setSelectedLabel('');
    list.setFilterText('');
  }, [value]);

  // Async list for autocomplete
  let list = useAsyncList<placeOption>({
    async load({ filterText }) {
      if (!getPlaces || !filterText) return { items: [] };
      const suggestions = await getPlaces(
        filterText,
        Date.now(),
        Date.now(),
        userLocation?.lat,
        userLocation?.lng
      );
      return { items: suggestions };
    },
  });

  async function handleSelection(key: React.Key | null) {
    if (!key || !getPlaceDetails) return;
    const selected = list.items.find((item) => item.value === key);
    if (!selected) return;

    setSelectedLabel(selected.label);
    list.setFilterText(selected.label);

    const place = await getPlaceDetails(selected.value);
    if (!place || !place.place.location) return;

    const location: LocationInput = {
      placeId: place.place.id,
      // Keep the selected suggestion text in the input for a stable UX.
      address: selected.label,
      lat: place.place.location.lat(),
      lng: place.place.location.lng(),
    };

    setLocationSelect(location);
    onChange(location);
  }

  return (
    <>
      <label className="flex w-full flex-col gap-1">
        <span>{label ?? 'Select Location'}</span>
        <input
          required={required}
          placeholder="Type to search..."
          value={list.filterText}
          list="location-search-options"
          data-cy="location-input"
          onChange={(event) => {
            const text = event.currentTarget.value;
            list.setFilterText(text);
            const selected = list.items.find((item) => item.label === text);
            if (selected) {
              void handleSelection(selected.value);
              return;
            }
            if (text !== selectedLabel) {
              setSelectedLabel('');
              setLocationSelect(null);
            }
          }}
          className="min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2"
        />
        <datalist id="location-search-options">
          {list.items.map((item) => (
            <option key={item.value} value={item.label} />
          ))}
        </datalist>
      </label>
      <input type="hidden" name="location" value={JSON.stringify(locationSelect)} />
    </>
  );
}
