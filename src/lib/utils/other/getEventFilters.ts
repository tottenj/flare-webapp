import eventType from '@/lib/enums/eventType';
import EventFilters from '@/lib/types/FilterType';
import parseEventByKey from './parseEventByKey';
import getKeyByValue from './getKeyByValue';
import AgeGroup from '@/lib/enums/AgeGroup';
import { getEnumValueByString } from './getEnumValueByString';
import getEnumValuesFromString from './getEnumFromKeyOrValue';

export default function getEventFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): EventFilters {
  const filters: EventFilters = {};
  const typeParam = searchParams.type;
  const ageParam = searchParams.age;
  if (typeParam) {
    const typeString = Array.isArray(typeParam) ? typeParam.join(',') : typeParam;
    filters.type = parseEventByKey(typeString) as eventType[];
  }

  if (ageParam) {
    const ageString = Array.isArray(ageParam) ? ageParam.join(',') : ageParam;
    const group = getEnumValuesFromString(AgeGroup, ageString) as AgeGroup[];
    if (group) {
      filters.ageGroup = group;
    }
  }

  const dateParam = Array.isArray(searchParams.date) ? searchParams.date[0] : searchParams.date;

  if (dateParam) {
    const [year, month, day] = dateParam.split('-').map(Number);
    filters.onDate = new Date(Date.UTC(year, month - 1, day)); // avoids timezone bugs
  }

  return filters;
}
