import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import { EVENT_CATEGORY_META, EventCategory } from '@/lib/types/EventCategory';
import { tagClasses, tagColorValue } from '@/lib/types/TagColour';

interface eventCategorySelectItemProps {
  category: EventCategory;
}

export default function EventCategorySelectItem({ category }: eventCategorySelectItemProps) {
  const { color, label } = EVENT_CATEGORY_META[category];

  return (
    <div className="bg-red flex items-center gap-4">
      <div className="border-default-200 bg-default-50 rounded-full border-2 p-2">
        <SVGLogo size={20} color={tagColorValue(color)} />
      </div>
      <p>{label}</p>
    </div>
  );
}
