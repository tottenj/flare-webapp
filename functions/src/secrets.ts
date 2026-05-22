import { defineSecret } from 'firebase-functions/params';

export const INTERNAL_API_KEY: ReturnType<typeof defineSecret> = defineSecret('INTERNAL_API_KEY');
