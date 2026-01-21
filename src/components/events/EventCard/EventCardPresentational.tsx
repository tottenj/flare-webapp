import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import IconText from '@/components/misc/iconText/IconText';
import MainModal from '@/components/modals/MainModal/MainModal';
import {
  faBan,
  faCalendar,
  faClock,
  faDollarSign,
  faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import { Chip } from '@heroui/react';
import Image from 'next/image';

interface EventCardProps {
  title: string;
  organizer: string;
  image: string;
  tags?: string[];
  dateLabel: string;
  timeLabel: string;
  timezoneLabel?: string;
  location: string;
  price: string;
  ageRestriction: string;
  description: string;
  ticketLink?: string;
}

export default function EventCardPresentational({
  title,
  organizer,
  image,
  tags,
  dateLabel,
  timeLabel,
  timezoneLabel,
  location,
  price,
  ageRestriction,
  description,
  ticketLink,
}: EventCardProps) {
  return (
    <div className="grid gap-6 pt-2 pb-2 md:grid-cols-[2.5fr_3fr]">
      <div className="group relative mx-auto aspect-[2/3] w-3/4 overflow-hidden rounded-md shadow-md md:w-full">
        <MainModal
          modalProps={{ size: '3xl', backdrop: 'blur' }}
          trigger={
            <button
              type="button"
              className="relative h-full w-full cursor-pointer focus:outline-none"
              aria-label={`View larger image for ${title}`}
              aria-haspopup="dialog"
            >
              <Image
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                src={image}
                alt={title}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw"
              />
            </button>
          }
        >
          <div className="relative aspect-[2/3] max-h-[90vh] w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-md object-contain"
              sizes="90vw"
            />
          </div>
        </MainModal>
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
      </div>

      <div className="flex flex-[1] flex-col gap-6 pt-2">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="!text-4xl leading-tight tracking-tight">{title}</h2>
          <p className="text-lg">{organizer}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {tags?.map((tag) => (
            <Chip
              color="secondary"
              variant="bordered"
              className="hover:bg-secondary-100 pr-2 pl-2"
              key={tag}
            >
              {tag}
            </Chip>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {dateLabel && <IconText text={dateLabel} icon={faCalendar} />}
          {timeLabel && <IconText text={timeLabel + ' ' + timezoneLabel} icon={faClock} />}
          <IconText text={location} icon={faLocationArrow} />
          <IconText text={price} icon={faDollarSign} />
          <IconText text={ageRestriction} icon={faBan} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">About This Event</h3>
          <p className="max-h-[14rem] overflow-scroll" tabIndex={0}>
            {description}
          </p>
        </div>
        {ticketLink && (
          <div className="mt-auto flex justify-center">
            <PrimaryButton text="Purchase Tickets" />
          </div>
        )}
      </div>
    </div>
  );
}
