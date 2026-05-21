import { defineSecret } from 'firebase-functions/params';

// 'SecretParam' type is not exported from firebase-functions/params in v6. Use 'any' as a workaround.
// TODO: Replace 'any' with correct type if/when it is exported.
export const INTERNAL_API_KEY: any = defineSecret('INTERNAL_API_KEY');
