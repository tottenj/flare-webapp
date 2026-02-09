

export const AGE_RANGE = {
  "All Ages": 'ALL_AGES',
  "18+" : 'AGE_18_PLUS',
  "19+" : 'AGE_19_PLUS',
  "21+" : 'AGE_21_PLUS',
  "65+" : 'AGE_65_PLUS'
} as const;


export const AGE_RANGE_OPTIONS = Object.entries(AGE_RANGE).map(([label, value]) => ({
  label,
  value,
}));
