enum eventType {
  'Special Events' = 'oklch(64.73% 0.2385 27.3)', //red
  'Drag Events' = 'oklch(76.97% 0.1627 74.52)', //orange
  'Casual Events' = 'oklch(91.41% 0.1528 104.99)', //yellow
  'Organizations' = 'oklch(74.62% 0.1947 152.04)', //green
  'Other' = 'oklch(48.68% 0.1387 270.64)', //blue
}

export type eventTypeKey = keyof typeof eventType;
export type eventTypeValue = (typeof eventType)[eventTypeKey];
export const eventTypeKeys = Object.keys(eventType) as eventTypeKey[];

export function getEventTypeKeyFromValue(value: string): keyof typeof eventType | undefined {
  return Object.keys(eventType).find(
    (key) => eventType[key as keyof typeof eventType] === value
  ) as keyof typeof eventType | undefined;
}

export function getEventTypeValueFromKey(key: keyof typeof eventType): string | undefined {
  return eventType[key];
}

type ColourOption = {
  label: string;
  value: string;
  color: string;
};

export const colourOptions: ColourOption[] = Object.entries(eventType).map(([label, color]) => ({
  label,
  value: label,
  color,
}));

export default eventType;
