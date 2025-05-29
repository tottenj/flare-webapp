import eventType from '@/lib/enums/eventType';

export default function parseEventTypes(typeParam: string | null | undefined): eventType[] {
  if (!typeParam) return [];

  const colorValues = typeParam.split(',');

  return Object.entries(eventType)
    .filter(([_, color]) => colorValues.includes(color))
    .map(([_, color]) => color as eventType);
}