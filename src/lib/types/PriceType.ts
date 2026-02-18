//Price Type Map
export const PRICE_TYPE = {
  Free: 'FREE',
  Fixed: 'FIXED',
  Range: 'RANGE',
  'Pay What You Can': 'PWYC',
} as const;


//Price Type label map
export const PRICE_TYPE_LABEL: Record<PriceTypeValue, string> = {
  FREE: 'Free',
  FIXED: 'Fixed Price',
  RANGE: 'Price Range',
  PWYC: 'Pay What You Can',
};

//For event Zod
export const PRICE_TYPE_VALUES = Object.values(PRICE_TYPE) as [PriceTypeValue, ...PriceTypeValue[]];

//Label and Value
export const PRICE_TYPE_OPTIONS = Object.entries(PRICE_TYPE).map(([label, value]) => ({
  label,
  value,
}))


//Type Tuple of the PRICE_TYPE
export type PriceTypeValue = (typeof PRICE_TYPE)[keyof typeof PRICE_TYPE];
