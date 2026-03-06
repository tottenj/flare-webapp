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
}

export default function EventListCardPresentational({
  eventId,
  title,
  category,
  description,
  ageRestriction,
  startDate,
}: eventListCardPresentationalProps) {
  const { color } = EVENT_CATEGORY_META[category];
  const ageRestrictionLabel = formatAgeRange(ageRestriction);
  const { dateLabel } = formatDateTime(startDate);

  return (
    <ModalLink route={`/event/${eventId}`}>
      <div className="group border-primary hover:bg-primary flex w-full gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:text-white hover:shadow-lg">
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
            <p>{description}</p>
          </div>
          <div className="flex flex-col">
            <p>{ageRestrictionLabel}</p>
            <p>{dateLabel}</p>
          </div>
        </div>
      </div>
    </ModalLink>
  );
}
