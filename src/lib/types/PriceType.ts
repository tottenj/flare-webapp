export const PRICE_TYPE = {
  Free: 'FREE',
  Fixed: 'FIXED',
  Range: 'RANGE',
  'Pay What You Can': 'PWYC',
} as const;

export const PRICE_TYPE_OPTIONS = Object.entries(PRICE_TYPE).map(([label, value]) => ({
  label,
  value,
}));
