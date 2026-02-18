import { TagColor } from '@/lib/types/TagColour';

export const EVENT_CATEGORY_META = {
  SOCIAL: {
    label: 'Social',
    color: 'pink' satisfies TagColor,
  },
  NIGHTLIFE: {
    label: 'Nightlife',
    color: 'purple',
  },
  CULTURE_ARTS: {
    label: 'Culture & Arts',
    color: 'orange',
  },
  WELLNESS: {
    label: 'Health & Wellness',
    color: 'teal',
  },
  ADVOCACY_EDUCATION: {
    label: 'Advocacy & Education',
    color: 'blue',
  },
  OTHER: {
    label: 'Other',
    color: 'yellow',
  },
} as const satisfies Record<string, { label: string; color: TagColor }>;

export type EventCategory = keyof typeof EVENT_CATEGORY_META;
export const EVENT_CATEGORIES = Object.entries(EVENT_CATEGORY_META).map(([key, value]) => ({
  key: key as EventCategory,
  ...value,
}));

