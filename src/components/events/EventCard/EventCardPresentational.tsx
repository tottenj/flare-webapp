'use client';
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
} from '@fortawesome/free-solid-svg-icons';
import { Chip } from '@heroui/react';
import Image from 'next/image';

export type EventCardDto = {
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

export default function EventCardPresentational({ event }: { event: EventCardDto }) {
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
  return (
    <div className="grid gap-6 rounded-2xl  p-4 pt-2 pb-2 md:grid-cols-[2.5fr_3fr]">
      {imageUrl && (
        <div className="group relative mx-auto aspect-[2/3] w-3/4 overflow-hidden rounded-md shadow-md md:w-full">
          <MainModal
            modalProps={{ size: '3xl', backdrop: 'blur' }}
            trigger={
              <Image
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src={imageUrl}
                alt={title}
                fill
                unoptimized={isDev}
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw"
              />
            }
          >
            <div className="relative aspect-[2/3] max-h-[90vh] w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                unoptimized={isDev}
                className="rounded-md object-contain"
                sizes="90vw"
              />
            </div>
          </MainModal>

          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
        </div>
      )}

      <div className="flex flex-[1] flex-col gap-6 pt-2">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="!text-4xl leading-tight tracking-tight">{title}</h2>
          <p className="text-lg">{organizerName}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Chip className="capitalize" color="secondary" variant="bordered">
            {ageRestrictionLabel}
          </Chip>
          {tags?.map((tag) => <TagChip label={tag} variant="bordered" key={tag} />)}
        </div>
        <div className="flex flex-col gap-2">
          {startDateLabel && <IconText text={startDateLabel} icon={faCalendar} />}
          {startTimeLabel && (
            <IconText text={startTimeLabel + ' ' + timezoneLabel} icon={faClock} />
          )}
          {locationLabel && <IconText text={locationLabel} icon={faLocationArrow} />}
          <IconText text={priceLabel} icon={faDollarSign} />
          <IconText text={ageRestrictionLabel} icon={faBan} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">About This Event</h3>
          <p className="max-h-[14rem] overflow-scroll" tabIndex={0}>
            {description}
          </p>
        </div>
        {ticketLink && (
          <div className="mt-auto flex justify-center">
            <PrimaryButton text="Get Tickets" />
          </div>
        )}
      </div>
    </div>
  );
}
