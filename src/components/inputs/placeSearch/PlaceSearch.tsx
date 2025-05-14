"use client"
import getPlaces from "@/lib/utils/getPlaces"
import { error } from "console";
import { useEffect, useState } from "react";

import AsyncSelect from "react-select/async"


interface placeOption{
    label: string
    value: string
}




export default function PlaceSearch(){
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

    let newestRequestId = 0
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

    

  return (
      <AsyncSelect<placeOption> 
      loadOptions={promiseOptions} />
  );
}