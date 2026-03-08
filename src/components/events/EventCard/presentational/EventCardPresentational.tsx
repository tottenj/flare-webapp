import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import IconText from '@/components/misc/iconText/IconText';
import MainModal from '@/components/modals/MainModal/MainModal';
import TagChip from '@/components/ui/TagChip/TagChip';
import {
  faBan,
  faCalendar,
  faClock,
  faDollarSign,
  faLocationArrow,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export type EventCardViewModel = {
  id?: string;
  title: string;
  organizerName: string;
  imageUrl?: string | null;
  tags: string[];

  startDateLabel: string;
  startTimeLabel: string;

  endDateLabel?: string;
  endTimeLabel?: string;
  timezoneLabel: string;

  locationLabel?: string | null;
  priceLabel: string;
  ageRestrictionLabel: string;

  description: string;
  ticketLink?: string;
};
const isDev = process.env.NODE_ENV === 'development';

export default function EventCardPresentational({ event }: { event: EventCardViewModel }) {
  const {
    title,
    organizerName,
    imageUrl,
    tags,
    startDateLabel,
    startTimeLabel,
    timezoneLabel,
    locationLabel,
    priceLabel,
    ageRestrictionLabel,
    description,
    ticketLink,
  } = event;

  type MetadataItem = {
    text: string;
    icon: IconDefinition;
  };
  const metadata = [
    startDateLabel && { text: startDateLabel, icon: faCalendar },
    startTimeLabel && { text: `${startTimeLabel} ${timezoneLabel}`, icon: faClock },
    locationLabel && { text: locationLabel, icon: faLocationArrow },
    ageRestrictionLabel && { text: ageRestrictionLabel, icon: faBan },
    { text: priceLabel, icon: faDollarSign },
  ];
  return (
    <div data-cy={`${title}-event-modal`} className="@container">
      <div className="grid gap-6 rounded-2xl p-4 pt-2 pb-2 @md:grid-cols-[2.5fr_3fr] @lg:grid-rows-[auto_auto]">
        <div className="group relative mx-auto aspect-[2/3] w-full max-w-[70cqw] overflow-hidden rounded-md shadow-md @md:max-w-[100cqw]">
          {imageUrl && (
            <>
              <MainModal
                modalProps={{ size: '3xl', backdrop: 'blur' }}
                trigger={
                  <Image
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    src={imageUrl}
                    alt={title}
                    fill
                    unoptimized={isDev}
                    sizes="100cqw"
                  />
                }
              >
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    unoptimized={isDev}
                    className="rounded-md object-contain"
                    sizes="90cqw"
                  />
                </div>
              </MainModal>

              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
            </>
          )}
        </div>

        <div className="flex flex-[1] flex-col gap-6 pt-2">
          <div className="flex flex-col items-center @xl:items-start">
            <h2 className="text-foreground-100 text-center leading-tight tracking-tight @3xs:text-left">
              {title}
            </h2>
            <p className="text-lg">{organizerName}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {tags?.map((tag) => (
              <TagChip label={tag} variant="bordered" key={tag} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {metadata
              .filter((item): item is MetadataItem => Boolean(item))
              .map((item, i) => (
                <IconText key={i} text={item.text} icon={item.icon} />
              ))}
          </div>
          <div className="row-start-1 flex flex-col gap-2 @md:hidden @2xl:flex">
            <h3 className="text-xl font-bold">About This Event</h3>
            <p className="scrollbar-thin max-h-[14rem] overflow-y-auto pr-2" tabIndex={0}>
              {description}
            </p>
          </div>
          {ticketLink && (
            <div className="mt-auto flex justify-center">
              <PrimaryButton text="Get Tickets" />
            </div>
          )}
        </div>
        <div className="col-span-2 row-start-2 hidden flex-col gap-2 @md:flex @2xl:hidden">
          <h3 className="text-xl font-bold">About This Event</h3>
          <p className="scrollbar-thin max-h-[14rem] overflow-y-auto pr-2" tabIndex={0}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
