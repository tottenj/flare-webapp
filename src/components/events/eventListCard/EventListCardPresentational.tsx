import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import { AGE_RANGE_LABEL, AgeRangeValue } from '@/lib/types/AgeRange';
import { EVENT_CATEGORY_META, EventCategory } from '@/lib/types/EventCategory';
import { getTagColor } from '@/lib/utils/ui/getTagColour';

interface eventListCardPresentationalProps {
  eventId:string;
  title: string;
  category: EventCategory;
  description: string;
  ageRestriction: AgeRangeValue;
  startDate:string
}

export default function EventListCardPresentational({
  eventId,
  title,
  category,
  description,
  ageRestriction,
  startDate
}: eventListCardPresentationalProps) {
  const { color } = EVENT_CATEGORY_META[category];

  return (
    <div className="group w-full border-primary hover:bg-primary flex gap-4 rounded-2xl border-2 p-4 transition-all ease-in-out hover:text-white">
      <div className="relative">
        <div className="group-hover:hidden">
          <SVGLogo size={45} color={getTagColor(color)} />
        </div>

        <div className="hidden group-hover:block">
          <SVGLogo size={45} color="white" />
        </div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <h3 className="font-nunito font-bold capitalize">{title}</h3>
          <p>{description}</p>
        </div>
        <div className="flex flex-col">
          <p>{AGE_RANGE_LABEL[ageRestriction]}</p>
          <p>{startDate}</p>
        </div>
      </div>
    </div>
  );
}
