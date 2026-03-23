'use client';

import { extractFieldErrors } from '@/lib/errors/extractError';
import {
  CreateEventPreviewForm,
  parsePreviewFormData,
} from '@/lib/schemas/event/createEventPreviewFormSchema';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { PriceTypeValue } from '@/lib/types/PriceType';
import { useState } from 'react';
import z from 'zod';

interface UseEventFormInitialState {
  location?: LocationInput | null;
  hasEndTime?: boolean;
  priceType?: PriceTypeValue;
  imgPreview?: string | null;
}

export default function useEventForm(initialState?: UseEventFormInitialState) {
  const [location, setLocation] = useState<LocationInput | null>(initialState?.location ?? null);
  const [hasEndTime, setHasEndTime] = useState(initialState?.hasEndTime ?? false);
  const [priceType, setPriceType] = useState<PriceTypeValue>(initialState?.priceType ?? 'FREE');
  const [previewErrors, setPreviewErrors] = useState<Record<string, string[]>>({});
  const [pendingFormData, setPendingFormData] = useState<CreateEventPreviewForm | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [eventImgPreview, setEventImgPreview] = useState<string | null>(initialState?.imgPreview ?? null);

  function handlePreview(formData: FormData) {
    const result = parsePreviewFormData(formData);
    if (!result.success) {
      const fieldErrors = extractFieldErrors(z.treeifyError(result.error));
      setPreviewErrors(fieldErrors);
      return;
    }
    setPreviewErrors({});
    setPendingFormData(result.data);
    setPreviewOpen(true);
  }

  return {
    location,
    setLocation,
    hasEndTime,
    setHasEndTime,
    priceType,
    setPriceType,
    previewErrors,
    setPreviewErrors,
    pendingFormData,
    previewOpen,
    setPreviewOpen,
    handlePreview,
    imgError,
    setImgError,
    eventImgPreview,
    setEventImgPreview
  };
}
