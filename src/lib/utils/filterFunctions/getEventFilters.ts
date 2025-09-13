import eventType from '@/lib/enums/eventType';
import EventFilters from '@/lib/types/FilterType';
import AgeGroup from '@/lib/enums/AgeGroup';
import getEnumValuesFromString from '../enumFunctions/getEnumFromKeyOrValue';

export default function getEventFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): EventFilters {
  const filters: EventFilters = {};
  const typeParam = searchParams.type;
  const ageParam = searchParams.age;
  const dateParam = Array.isArray(searchParams.date) ? searchParams.date[0] : searchParams.date;

  const latParam = searchParams.lat;
  const lngParam = searchParams.lng;
  const radiusParam = searchParams.radius;

  if (latParam && lngParam && radiusParam) {
    const lat = parseFloat(latParam as string);
    const lng = parseFloat(lngParam as string);
    const radius = parseFloat(radiusParam as string);

    if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius)) {
      filters.location = {
        center: { lat, lng },
        radius: radius,
      };
    }
  }

  if (typeParam) {
    const typeString = Array.isArray(typeParam) ? typeParam.join(',') : typeParam;
    filters.type = getEnumValuesFromString(eventType,typeString) as eventType[];
  }

  if (ageParam) {
    const ageString = Array.isArray(ageParam) ? ageParam.join(',') : ageParam;
    const group = getEnumValuesFromString(AgeGroup, ageString) as AgeGroup[];
    if (group) {
      filters.ageGroup = group;
    }
  }

  if (dateParam) {
    const [year, month, day] = dateParam.split('-').map(Number);
    filters.onDate = new Date(Date.UTC(year, month - 1, day + 1)); // avoids timezone bugs
  }

  return filters;
}
