import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import IconText from '@/components/misc/iconText/IconText';
import {
  faCalendar,
  faCalendarAlt,
  faDollarSign,
  faLocation,
  faLocationArrow,
} from '@fortawesome/free-solid-svg-icons';
import { Chip } from '@heroui/react';
import Image from 'next/image';

interface EventCardProps {
  title: string;
  organizer: string;
  image: string;
  tags?: string[];
  date?: string;
  location: string;
  price: string;
  description: string;
}

export default function EventCardPresentational({
  title,
  organizer,
  image,
  tags,
  date,
  location,
  price,
  description,
}: EventCardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-[2fr_3fr] pt-2 pb-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md">
        <Image
          className="object-cover"
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 90vw"
        />
      </div>

      <div className="flex flex-[1] flex-col gap-6 pt-2 pb-2">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="!text-3xl">{title}</h2>
          <p className="text-lg">{organizer}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {tags?.map((tag) => (
            <Chip className="pr-2 pl-2" key={tag}>
              {tag}
            </Chip>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <IconText text={date ?? ''} icon={faCalendar} />
          <IconText text={location} icon={faLocationArrow} />
          <IconText text={price} icon={faDollarSign} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold">About This Event</h3>
          <p>{description}</p>
        </div>
        <div className="mt-auto flex justify-center md:justify-start">
          <PrimaryButton text="Purchase Tickets" />
        </div>
      </div>
    </div>
  );
}
