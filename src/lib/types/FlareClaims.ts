// lib/types/FlareClaims.ts
export interface FlareClaims {
  org?: boolean;
  verified?: boolean;
  admin?: boolean;
  [key: string]: any; // optional catch-all for future
}
