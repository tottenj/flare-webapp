export const PRICE_TYPE = {
  Free: 'FREE',
  Fixed: 'FIXED',
  Range: 'RANGE',
  'Pay What You Can': 'PWYC',
} as const;

export const PRICE_TYPE_LABEL: Record<PriceTypeValue, string> = {
  FREE: 'Free',
  FIXED: 'Fixed Price',
  RANGE: 'Price Range',
  PWYC: 'Pay What You Can',
};

export const PRICE_TYPE_OPTIONS = Object.entries(PRICE_TYPE).map(([label, value]) => ({
  label,
  value,
})) as {
  label: string;
  value: PriceTypeValue;
}[];

export type PriceTypeValue = (typeof PRICE_TYPE)[keyof typeof PRICE_TYPE];
