import eventType from '@/lib/enums/eventType';

export default function parseEventByKey(typeParam: string | null | undefined): eventType[] {
  if (!typeParam) return [];

  const typeNames = typeParam.split(',');

  return typeNames
    .map((name) => {
      const entry = Object.entries(eventType).find(([key]) => key === name);
      return entry ? (entry[1] as eventType) : null;
    })
    .filter((val): val is eventType => val !== null);
}
