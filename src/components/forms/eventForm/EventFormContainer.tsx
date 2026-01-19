"use client"
import EventFormPresentational from "@/components/forms/eventForm/EventFormPresentational";
import { LocationInput } from "@/lib/schemas/LocationInputSchema";
import { useState } from "react";

export default function EventFormContainer() {
  const [location, setLocation] = useState<LocationInput | null>(null);

  
  return (
    <EventFormPresentational changeLocVal={setLocation}/>
  )
}