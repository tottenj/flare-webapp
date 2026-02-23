'use server';
import { EventCardDto } from '@/components/events/EventCard/EventCardPresentational';
import ImageService from '@/lib/services/imageService/ImageService';
import { EventDto } from '@/lib/types/dto/EventDto';
import formatAgeRange from '@/lib/utils/ui/formatAgeRange/formatAgeRange';
import { EventDateTimeLabels, formatDateTime } from '@/lib/utils/ui/formatDateTime/formatDateTime';
import formatEventPrice from '@/lib/utils/ui/formatEventPrice/formatEventPrice';

export default async function mapEventDtoToCardDto(event: EventDto): Promise<EventCardDto> {
  let imgUrl: string | null = null;
  if (event.imagePath) {
    try {
      imgUrl = await ImageService.getDownloadUrl(event.imagePath);
    } catch (error) {
      imgUrl = null;
    }
  }
  const startDateTimeLabels = formatDateTime(event.startsAt);
  let endDateTimeLabels: EventDateTimeLabels | null | undefined = null;
  if (event.endsAt) {
    endDateTimeLabels = formatDateTime(event.endsAt);
  }

  let tags: string[] = [];
  if (event.tags.length > 0) {
    tags = event.tags.map((tag) => {
      return tag.label;
    });
  }

  return {
    id: event.id,
    title: event.title,
    organizerName: event.organization.name,
    imageUrl: imgUrl,
    tags: tags,
    startDateLabel: startDateTimeLabels.dateLabel,
    startTimeLabel: startDateTimeLabels.timeLabel,
    endDateLabel: endDateTimeLabels?.dateLabel,
    endTimeLabel: endDateTimeLabels?.timeLabel,
    timezoneLabel: startDateTimeLabels.timezoneLabel,
    locationLabel: event.location.address,
    priceLabel: formatEventPrice({
      priceType: event.pricing.type,
      minPrice: event.pricing.minCents,
      maxPrice: event.pricing.maxCents,
    }),
    ageRestrictionLabel: formatAgeRange(event.ageRestriction),
    description: event.description,
  };
}
