// lib/types/FlareClaims.ts
export interface FlareClaims {
  org?: boolean;
  verified?: boolean;
  admin?: boolean;
}



export interface FlareContext extends FlareClaims{
  uid?: string
}

export type FlareClaimKeys = keyof FlareClaims; 