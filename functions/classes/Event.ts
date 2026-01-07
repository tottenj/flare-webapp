
import eventType, { getEventTypeKeyFromValue } from '../../enums/EventType'
import flareLocation from './flareLocation';
import { DocumentData } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Geohash, geohashForLocation } from 'geofire-common';

export type EventArgs = {
  flare_id: string;
  title: string;
  description?: string;
  type: eventType;
  ageGroup: string;
  startDate: Date;
  endDate: Date;
  location: flareLocation;
  price: number | string;
  verified?: boolean;
  createdAt?: Date;
  ticketLink?: string;
  id?: string;
};

export default class Event {
  id: string;
  flare_id: string;
  title: string;
  description?: string;
  type: eventType;
  ageGroup: string;
  startDate: Date;
  endDate: Date;
  location: flareLocation;
  price: number | string;
  ticketLink?: string;
  verified: boolean;
  createdAt: Date;

  constructor({
    flare_id,
    title,
    description,
    type,
    ageGroup,
    startDate,
    endDate,
    location,
    price,
    verified = false,
    createdAt = new Date(),
    ticketLink,
    id,
  }: EventArgs) {
    this.id = id ?? uuidv4();
    this.flare_id = flare_id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.ageGroup = ageGroup;
    this.startDate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.price = price;
    this.verified = verified;
    this.createdAt = createdAt;
    this.ticketLink = ticketLink;
  }

  get hash(): Geohash {
    return geohashForLocation([
      this.location.coordinates.latitude,
      this.location.coordinates.longitude,
    ]);
  }
}

export const eventConverter = {
  toFirestore(event: Event): DocumentData {
    const evenType = getEventTypeKeyFromValue(event.type);
    
    return {
      id: event.id,
      flare_id: event.flare_id,
      title: event.title,
      description: event.description,
      type: evenType,
      ageGroup: event.ageGroup,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      price: event.price,
      verified: event.verified,
      createdAt: event.createdAt,
      ticketLink: event.ticketLink,
      hash: event.hash,
    };
  },
};
