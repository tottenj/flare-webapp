'use client';

import { useEffect, useState } from 'react';
import { GeoPoint } from 'firebase/firestore';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useAsyncList } from '@react-stately/data';

import PrimaryLabel from '../labels/primaryLabel/PrimaryLabel';
import flareLocation from '@/lib/types/Location';
import getPlaces from '@/lib/utils/places/getPlaces/getPlaces';
import { getPlaceDetails } from '@/lib/utils/places/getPlaceDetails/getPlaceDetails';

interface placeOption {
  label: string;
  value: string;
}

interface placeSearchProps {
  loc: (loc: flareLocation | null) => void;
  lab?: string;
  required?: boolean;
  z?: string;
  defVal?: placeOption;
}

export default function PlaceSearch({ loc, lab, required = true, z, defVal }: placeSearchProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  // Async list for autocomplete
  let list = useAsyncList<placeOption>({
    async load({ filterText }) {
      if (!filterText) return { items: [] };
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
    if (!key) return;
    const selected = list.items.find((item) => item.value === key);
    if (!selected) return;
    const place = await getPlaceDetails(selected.value);
    if (!place || !place.place.location) return;
    const location: flareLocation = {
      id: place.place.id,
      name: place.place.displayName,
      coordinates: new GeoPoint(place.place.location.lat(), place.place.location.lng()),
    };
    loc(location);
  }

  return (
    <Autocomplete
      label="Select Location"
      placeholder="Type to search..."
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      variant="flat"
      defaultSelectedKey={defVal?.value}
      onInputChange={list.setFilterText}
      onSelectionChange={handleSelection}
      radius="sm"
      classNames={{
        popoverContent: 'rounded-none',
        listbox: 'outline-none focus:outline-none',
      }}
    >
      {(item) => (
        <AutocompleteItem key={item.value} className="capitalize">
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
