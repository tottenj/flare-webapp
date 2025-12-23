'use server';
import getEventFiltersFromSearchParams from '@/lib/utils/filterFunctions/getEventFilters';

export default async function EventView({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
 

  const filters = getEventFiltersFromSearchParams(resolvedSearchParams);
  const filterCopy = { ...filters };

  delete filters.onDate;

  let plainMonthsEvents;
  

  return (
    <>
     
    </>
  );
}
