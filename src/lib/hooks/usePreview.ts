'use client';

import { useState } from 'react';
import { convertFormData } from '../zod/convertFormData';
import { CreateEventSchema } from '../zod/event/createEventSchema';
import { toast } from 'react-toastify';
import useUnifiedUser from './useUnifiedUser';
import Event, { PlainEvent } from '../classes/event/Event';
import getFormattedDateString from '../utils/dateTime/getFormattedDateString';

export default function usePreview() {
  const [previewData, setPreviewData] = useState<PlainEvent | null>(null);
  const { user } = useUnifiedUser();

  function handlePreviewClick(e: React.MouseEvent<HTMLButtonElement>): any {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget.form;
    if (!form) return;
    const formData = new FormData(form);
    const res = convertFormData(CreateEventSchema, formData);

    if (!res.success) {
      toast.error('Please Fill In All Required Fields');
      console.log(res.error);
    } else if (!user?.uid) {
      toast.error('Authentication Error');
    } else {
      const { data } = res;

      setPreviewData(
        new Event({
          id: '123',
          flare_id: '',
          verified: false,
          createdAt: new Date(),
          ...data,
        }).toPlain()
      );
    }
  }

  return { previewData, handlePreviewClick, setPreviewData };
}
