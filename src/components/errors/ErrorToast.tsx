'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';


export default function ErrorToast({ message }: { message: string }) {
  useEffect(() => {
    toast.error(message);
  }, [message]);

  return null; // nothing visible, just triggers toast
}
