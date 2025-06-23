// .storybook/__mocks__/classes/event/Event.ts

import { GeoPoint } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

enum eventType {
  'Special Events' = 'oklch(64.73% 0.2385 27.3)', //red
  'Drag Events' = 'oklch(76.97% 0.1627 74.52)', //orange
  'Casual Events' = 'oklch(91.41% 0.1528 104.99)', //yellow
  'Organizations' = 'oklch(74.62% 0.1947 152.04)', //green
  'Other' = 'oklch(48.68% 0.1387 270.64)', //blue
}

enum AgeGroup {
  AllAges = 'All Ages',
  Adults = 'Adults (19+)',
  Youth = 'Youth (< 19)',
  Mature = 'Mature (50+)',
}

// Local stub of flareLocation to fix module resolution error
type flareLocation = {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

// Minimal redefinition to match your actual structure
class Event {
  id: string;
  flare_id: string;
  title: string;
  description: string;
  type: eventType;
  ageGroup: AgeGroup;
  startdate: Date;
  endDate: Date;
  location: flareLocation;
  price: number | string;
  ticketLink?: string;
  verified: boolean;
  createdAt: Date;

  constructor(
    flare_id: string,
    title: string,
    description: string,
    type: eventType,
    ageGroup: AgeGroup,
    startDate: Date,
    endDate: Date,
    location: flareLocation,
    price: number | string,
    verified: boolean = false,
    createdAt: Date = new Date(),
    ticketLink?: string,
    id?: string
  ) {
    this.id = id ?? Math.random().toString();
    this.flare_id = flare_id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.ageGroup = ageGroup;
    this.startdate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.price = price;
    this.verified = verified;
    this.createdAt = createdAt;
    this.ticketLink = ticketLink;
  }

  static async queryEvents(_fire: Firestore, _filters: any): Promise<Event[]> {
    return [
      new Event(
        'flare001',
        'Queer Skate Night',
        'Roller disco for all gender identities and sexualities.',
        'Other' as eventType,
        'AllAges' as AgeGroup,
        new Date('2025-08-01T18:00:00'),
        new Date('2025-08-01T21:00:00'),
        {
          id: 'loc001',
          name: 'Skate City',
          coordinates: new GeoPoint(43.6532, -79.3832), // Toronto
        },
        5,
        true,
        new Date(),
        'https://tickets.flareskate.com',
        'event001'
      ),
      new Event(
        'flare002',
        'Trans Yoga and Chill',
        'Gentle yoga session followed by snacks and community time.',
        'Wellness' as eventType,
        'AdultsOnly' as AgeGroup,
        new Date('2025-08-03T10:00:00'),
        new Date('2025-08-03T12:00:00'),
        {
          id: 'loc002',
          name: 'Lotus Studio',
          coordinates: new GeoPoint(43.7, -79.4), // another location
        },
        0,
        true,
        new Date(),
        undefined,
        'event002'
      ),
    ];
  }

  toPlain() {
    return { ...this };
  }
}

export default Event;
