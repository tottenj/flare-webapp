'use client';

import FilterModalContainer from '@/components/events/filters/FilterModalContainer';
import MainModal from '@/components/modals/MainModal/MainModal';
import HeroChip from '@/components/ui/HeroChip/HeroChip';
import useQueryFilters from '@/lib/hooks/useQueryFilters';
import { UserEventUrlFilter } from '@/lib/schemas/event/userEventUrlFilterSchema';
import { EventFilterDataDto } from '@/lib/types/dto/event/EventFilterDataDto';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EventListWithFilters({
  children,
  filterData,
}: {
  children: React.ReactNode;
  filterData: EventFilterDataDto;
}) {
  const { filters, setFilters } = useQueryFilters<UserEventUrlFilter>();

  return (
    <div className="relative flex flex-1 flex-col gap-4 rounded-2xl bg-white p-4 shadow-2xl">
      <div className="flex">
        <h2>Events</h2>

        <MainModal
          modalProps={{ size: '4xl' }}
          trigger={
            <button
              data-cy="events-filter-trigger"
              className="absolute right-4 cursor-pointer text-2xl"
            >
              <FontAwesomeIcon icon={faFilter} />
            </button>
          }
        >
          <FilterModalContainer {...filterData} />
        </MainModal>
      </div>
      <div data-cy="events-active-filter-chips" className="flex">
        {Object.entries(filters).map(([key, value]) => {
          if (key === 'distance') return null;
          if (key === 'placeId') {
            return (
              <HeroChip
                data-cy={`events-filter-chip-${key}`}
                color="secondary"
                key={key}
                onClose={() => setFilters({ [key]: null })}
              >
                {filterData.location?.address ?? 'Selected location'}
              </HeroChip>
            );
          }
          return (
            <HeroChip
              data-cy={`events-filter-chip-${key}`}
              color="secondary"
              key={key}
              onClose={() => setFilters({ [key]: null })}
            >
              {value}
            </HeroChip>
          );
        })}
      </div>

      {children}
    </div>
  );
}
