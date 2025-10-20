// lib/types/FlareClaims.ts
export interface FlareClaims {
  org?: boolean;
  verified?: boolean;
  admin?: boolean;
}

export type FlareClaimKeys = keyof FlareClaims; 