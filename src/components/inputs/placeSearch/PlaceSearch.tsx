'use client';
import { getPlaceDetails } from '@/lib/utils/places/getPlaceDetails/getPlaceDetails';
import getPlaces from '@/lib/utils/places/getPlaces/getPlaces';
import { useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';
import PrimaryLabel from '../labels/primaryLabel/PrimaryLabel';
import flareLocation from '@/lib/types/Location';
import { GeoPoint } from 'firebase/firestore';

interface placeOption {
  label: string;
  value: string;
}

interface placeSearchProps {
  loc: (loc: flareLocation | null) => void;
  lab?: string;
  required?: boolean;
  z?:string
  defVal?: placeOption
}

export default function PlaceSearch({ loc, lab, required = true,z, defVal }: placeSearchProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }),
        (error: any) => {
          console.warn('Geolocation failed or denied', error);
        };
    }
  }, []);

  let newestRequestId = 0;
  const promiseOptions = (inputValue: string): Promise<placeOption[]> => {
    return new Promise((resolve) => {
      const requestId = ++newestRequestId;
      getPlaces(inputValue, requestId, newestRequestId, userLocation?.lat, userLocation?.lng)
        .then((suggestions) => {
          if (requestId === newestRequestId) {
            resolve(suggestions);
          } else {
            resolve([]);
          }
        })
        .catch(() => {
          resolve([]);
        });
    });
  };

  async function changed(newValue: placeOption | null) {
    if (newValue) {
      const place = await getPlaceDetails(newValue.value);
      if (!place || !place.place.location) return null;
      const location: flareLocation = {
        id: place.place.id,
        name: place.place.displayName,
        coordinates: new GeoPoint(place.place.location.lat(), place.place.location.lng()),
      };
      loc(location);
    }
  }

  return (
    <>
      <PrimaryLabel label={lab} />
      <AsyncSelect<placeOption>
        required={required}
        menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: 'rgba(221, 218, 218, 0.5)',
            color: '#5f4a4a',
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
        className={`${z}`}
        placeholder={'Select Location...'}
        loadOptions={promiseOptions}
        onChange={(newVal) => changed(newVal)}
        defaultValue={defVal}
      />
    </>
  );
}
