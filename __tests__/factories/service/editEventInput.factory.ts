import { EditEventInput } from '@/lib/schemas/event/editEventInputSchema';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { AgeRestriction, EventCategory } from '#prisma/generated/enums';

export function editEventInputFactory(
  overrides: Partial<EditEventInput> = {},
  firebaseUid: string = 'uid3'
): EditEventInput {
  const existingImagePath = `events/${firebaseUid}/existing-image.jpg`;
  const newImagePath = `events/${firebaseUid}/new-image.jpg`;

  const base: EditEventInput = {
    eventName: 'Updated Event',
    eventDescription: 'Updated description',
    startDateTime: '2030-01-01T19:00:00+00:00[UTC]',
    status: 'PUBLISHED',
    ageRestriction: AgeRestriction.ALL_AGES,
    location: {
      placeId: 'place-123',
      address: '123 Main St',
      lat: 40.7128,
      lng: -74.006,
    },
    image: {
      isNew: false,
      storagePath: existingImagePath,
    },
    category: EventCategory.SOCIAL,
    priceType: PRICE_TYPE.Free,
    tags: ['tag1', 'tag2'],
  };

  const image: EditEventInput['image'] =
    overrides.image === undefined
      ? base.image
      : overrides.image.isNew
        ? {
            isNew: true,
            metadata: {
              contentType: overrides.image.metadata?.contentType ?? 'image/jpeg',
              sizeBytes: overrides.image.metadata?.sizeBytes ?? 1024,
              originalName: overrides.image.metadata?.originalName ?? 'new-image.jpg',
              storagePath: overrides.image.metadata?.storagePath ?? newImagePath,
            },
          }
        : {
            // Existing images use image.storagePath while new images use metadata.storagePath.
            isNew: false,
            storagePath:
              'storagePath' in overrides.image && overrides.image.storagePath
                ? overrides.image.storagePath
                : existingImagePath,
          };

  return {
    ...base,
    ...overrides,
    image,
    location:
      overrides.location === undefined
        ? base.location
        : overrides.location === null
          ? null
          : {
              ...base.location,
              ...overrides.location,
            },
  };
}
