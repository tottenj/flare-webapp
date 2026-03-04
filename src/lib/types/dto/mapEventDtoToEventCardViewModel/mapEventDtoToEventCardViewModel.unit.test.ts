import ImageService from '@/lib/services/imageService/ImageService';
import formatAgeRange from '@/lib/utils/ui/formatAgeRange/formatAgeRange';
import { formatDateTime } from '@/lib/utils/ui/formatDateTime/formatDateTime';
import formatEventPrice from '@/lib/utils/ui/formatEventPrice/formatEventPrice';
import { eventDtoFactory } from '../../../../../__tests__/factories/dto/eventDto.factory';
import mapEventDtoToEventCardViewModel from '@/lib/types/dto/mapEventDtoToEventCardViewModel/mapEventDtoToEventCardViewModel';
import { expect } from '@jest/globals';

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    getDownloadUrl: jest.fn(),
  },
}));

jest.mock('@/lib/utils/ui/formatAgeRange/formatAgeRange');
jest.mock('@/lib/utils/ui/formatEventPrice/formatEventPrice');
jest.mock('@/lib/utils/ui/formatDateTime/formatDateTime');

describe('mapEventDtoToEventCardViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (formatDateTime as jest.Mock).mockReturnValue({
      dateLabel: 'dateLabel',
      timeLabel: 'timeLabel',
      timezoneLabel: 'timezoneLabel',
    });
    (formatEventPrice as jest.Mock).mockReturnValue('eventPrice');
    (formatAgeRange as jest.Mock).mockReturnValue('ageRangeLabel');
  });

  it('successfully returns mapped event', async () => {
    (ImageService.getDownloadUrl as jest.Mock).mockResolvedValueOnce('imageUrl');
    const input = eventDtoFactory({
      id: 'event1',
      title: 'Test Event',
      description: 'Test Description',
      imagePath: 'images/test.png',
      tags: [
        { id: '1', label: 'Party' },
        { id: '2', label: 'Queer' },
      ],
    });
    const res = await mapEventDtoToEventCardViewModel(input);
    expect(ImageService.getDownloadUrl).toHaveBeenCalledWith('images/test.png');
    expect(formatDateTime).toHaveBeenCalledWith(input.startsAt);
    expect(formatDateTime).toHaveBeenCalledWith(input.endsAt);
    expect(formatEventPrice).toHaveBeenCalledWith({
      priceType: input.pricing.type,
      minPrice: input.pricing.minCents,
      maxPrice: input.pricing.maxCents,
    });
    expect(formatAgeRange).toHaveBeenCalledWith(input.ageRestriction);
    expect(res).not.toBeNull();
    expect(res).toMatchObject({
      id: 'event1',
      title: 'Test Event',
      organizerName: input.organization.name,
      imageUrl: 'imageUrl',
      tags: ['Party', 'Queer'],
      startDateLabel: 'dateLabel',
      startTimeLabel: 'timeLabel',
      endDateLabel: 'dateLabel',
      endTimeLabel: 'timeLabel',
      timezoneLabel: 'timezoneLabel',
      locationLabel: input.location.address,
      priceLabel: 'eventPrice',
      ageRestrictionLabel: 'ageRangeLabel',
      description: 'Test Description',
    });
  });

  it('returns null imageUrl if image service fails', async () => {
    (ImageService.getDownloadUrl as jest.Mock).mockRejectedValueOnce(new Error());
    const input = eventDtoFactory({
      imagePath: 'images/test.png',
    });
    const res = await mapEventDtoToEventCardViewModel(input);
    expect(res.imageUrl).toBeNull();
  });
});
