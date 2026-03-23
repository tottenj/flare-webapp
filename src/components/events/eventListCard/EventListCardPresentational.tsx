import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import ModalLink from '@/components/modals/ModalLink/ModalLink';
import { AgeRangeValue } from '@/lib/types/AgeRange';
import { EVENT_CATEGORY_META, EventCategory } from '@/lib/types/EventCategory';
import { tagColorValue } from '@/lib/types/TagColour';
import formatAgeRange from '@/lib/utils/ui/formatAgeRange/formatAgeRange';
import { formatDateTime } from '@/lib/utils/ui/formatDateTime/formatDateTime';

interface eventListCardPresentationalProps {
  eventId: string;
  title: string;
  category: EventCategory;
  description: string;
  ageRestriction: AgeRangeValue;
  startDate: string;

  actions?: React.ReactNode;
}

export default function EventListCardPresentational({
  eventId,
  title,
  category,
  description,
  ageRestriction,
  startDate,
  actions,
}: eventListCardPresentationalProps) {
  const { color } = EVENT_CATEGORY_META[category];
  const ageRestrictionLabel = formatAgeRange(ageRestriction);
  const { dateLabel } = formatDateTime(startDate);

  return (
    <div className="group border-primary hover:bg-primary relative flex w-full cursor-pointer gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:text-white hover:shadow-lg">
      <ModalLink route={`/event/${eventId}`} aria-label={title} className="absolute inset-0 z-10" />

      {actions && (
        <div className="absolute top-2 right-4 z-20 hidden text-white group-hover:block">
          {actions}
        </div>
      )}

      <div className="relative z-0 flex w-full gap-4">
        <div className="relative">
          <div className="group-hover:hidden">
            <SVGLogo size={45} color={tagColorValue(color)} />
          </div>

          <div className="hidden group-hover:block">
            <SVGLogo size={45} color="white" />
          </div>
        </div>

        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <h3 className="font-nunito font-bold capitalize">{title}</h3>
            <p className="line-clamp-2">{description}</p>
          </div>
          <div className="flex flex-col justify-end text-right">
            <p>{ageRestrictionLabel}</p>
            <p>{dateLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
