import AgeGroup from '@/lib/enums/AgeGroup';
import Collections from '@/lib/enums/collections';
import eventType from '@/lib/enums/eventType';
import { addDocument, getCollectionByFields, getDocument, WhereClause } from '@/lib/firebase/firestore/firestoreOperations';
import EventFilters from '@/lib/types/FilterType';
import flareLocation from '@/lib/types/Location';
import { QueryOptions } from '@testing-library/dom';
import {
  DocumentData,
  Firestore,
  GeoPoint,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export default class Event {
  id: string;
  flare_id: string;
  title: string;
  description: string;
  type: eventType;
  ageGroup: AgeGroup;
  date: Date;
  location: flareLocation;
  price: number | string;
  ticketLink?: string;

  constructor(
    id: string = uuidv4(),
    flare_id: string,
    title: string,
    desciption: string,
    type: eventType,
    ageGroup: AgeGroup,
    date: Date,
    location: flareLocation,
    price: number | string,
    ticketLink?: string
  ) {
    this.id = id;
    this.flare_id = flare_id;
    this.title = title;
    this.description = desciption;
    this.type = type;
    this.ageGroup = ageGroup;
    this.date = date;
    this.location = location;
    this.price = price;
    this.ticketLink = ticketLink;
  }

  async addEvent(dab: Firestore) {
    await addDocument(dab, `${Collections.Events}/${this.id}`, this, eventConverter);
  }

  static async getEvent(dab: Firestore, eventId: string){
    const even =  await getDocument(dab, `${Collections.Events}/${eventId}`, eventConverter)
    if(!even.exists())return null
    return even.data()
  }


  static async queryEvents(dab: Firestore, filters: EventFilters = {}, options?: QueryOptions){
    const whereClauses: WhereClause[] = []

    if(filters.flare_id) whereClauses.push(['flareId', "==", filters.flare_id])
    if(filters.onDate) whereClauses.push(['date', '==', filters.onDate])
    if(filters.ageGroup) whereClauses.push(['type', 'in', filters.ageGroup])
    if(filters.type) whereClauses.push(['type', "in", filters.type])
    if(filters.afterDate) whereClauses.push(['date', "<", filters.afterDate])
    if(filters.beforeDate) whereClauses.push(['date', '>=', filters.beforeDate])
    return await getCollectionByFields(dab, `${Collections.Events}`,whereClauses, eventConverter, options )
    
  }

  static sampleEvents: Event[] = [
    new Event(
      '1',
      'flare001',
      'Annual Pride Gala',
      'A formal evening celebrating LGBTQ+ community leaders.',
      eventType['Special Events'],
      AgeGroup.Adults,
      new Date('2025-05-01T19:00:00'),
      {
        id: 'loc001',
        name: 'City Hall Ballroom',
        coordinates: new GeoPoint(43.6532, -79.3832), // Toronto, Canada
      },
      75,
      'https://pridegala.org/tickets'
    ),
    new Event(
      '2',
      'flare002',
      'Drag Brunch Bash',
      'Enjoy brunch and fierce performances by local drag artists.',
      eventType['Drag Events'],
      AgeGroup.AllAges,
      new Date('2025-05-15T11:00:00'),
      {
        id: 'loc002',
        name: 'The Rainbow Diner',
        coordinates: new GeoPoint(40.7128, -74.006), // NYC
      },
      30
    ),
    new Event(
      '3',
      'flare003',
      'Picnic in the Park',
      'A laid-back afternoon with games and music.',
      eventType['Casual Events'],
      AgeGroup.AllAges,
      new Date('2025-05-01T14:00:00'),
      {
        id: 'loc003',
        name: 'Central Park West',
        coordinates: new GeoPoint(40.7851, -73.9683),
      },
      'Free'
    ),
    new Event(
      '4',
      'flare004',
      'Queer Youth Collective',
      'Weekly meet-up for queer youth to connect and grow.',
      eventType['Organizations'],
      AgeGroup.Youth,
      new Date('2025-06-20T16:00:00'),
      {
        id: 'loc004',
        name: 'Community Center Room 204',
        coordinates: new GeoPoint(49.2827, -123.1207), // Vancouver
      },
      0
    ),
    new Event(
      '5',
      'flare005',
      'Open Mic Night',
      'Share your poetry, music, or comedy in a safe space.',
      eventType['Other'],
      AgeGroup.AllAges,
      new Date('2025-07-10T18:30:00'),
      {
        id: 'loc005',
        name: 'The Cozy Corner',
        coordinates: new GeoPoint(41.8781, -87.6298), // Chicago
      },
      10
    ),
    new Event(
      '1',
      'flare001',
      'Annual Pride Gala',
      'A formal evening celebrating LGBTQ+ community leaders.',
      eventType['Special Events'],
      AgeGroup.Adults,
      new Date('2025-05-01T19:00:00'),
      {
        id: 'loc001',
        name: 'City Hall Ballroom',
        coordinates: new GeoPoint(43.6532, -79.3832), // Toronto, Canada
      },
      75,
      'https://pridegala.org/tickets'
    ),
    new Event(
      '2',
      'flare002',
      'Drag Brunch Bash',
      'Enjoy brunch and fierce performances by local drag artists.',
      eventType['Drag Events'],
      AgeGroup.AllAges,
      new Date('2025-05-15T11:00:00'),
      {
        id: 'loc002',
        name: 'The Rainbow Diner',
        coordinates: new GeoPoint(40.7128, -74.006), // NYC
      },
      30
    ),
    new Event(
      '3',
      'flare003',
      'Picnic in the Park',
      'A laid-back afternoon with games and music.',
      eventType['Casual Events'],
      AgeGroup.AllAges,
      new Date('2025-05-01T14:00:00'),
      {
        id: 'loc003',
        name: 'Central Park West',
        coordinates: new GeoPoint(40.7851, -73.9683),
      },
      'Free'
    ),
    new Event(
      '4',
      'flare004',
      'Queer Youth Collective',
      'Weekly meet-up for queer youth to connect and grow.',
      eventType['Organizations'],
      AgeGroup.Youth,
      new Date('2025-06-20T16:00:00'),
      {
        id: 'loc004',
        name: 'Community Center Room 204',
        coordinates: new GeoPoint(49.2827, -123.1207), // Vancouver
      },
      0
    ),
    new Event(
      '5',
      'flare005',
      'Open Mic Night',
      'Share your poetry, music, or comedy in a safe space.',
      eventType['Other'],
      AgeGroup.AllAges,
      new Date('2025-07-10T18:30:00'),
      {
        id: 'loc005',
        name: 'The Cozy Corner',
        coordinates: new GeoPoint(41.8781, -87.6298), // Chicago
      },
      10
    ),
  ];

  toPlain() {
    return {
      id: this.id,
      flare_id: this.flare_id,
      title: this.title,
      description: this.description,
      type: this.type,
      ageGroup: this.ageGroup,
      date: this.date.toISOString(), // stringify Date for client safety
      location: {
        id: this.location.id,
        name: this.location.name,
        coordinates: {
          latitude: this.location.coordinates.latitude,
          longitude: this.location.coordinates.longitude,
        },
      },
      price: this.price,
      ticketLink: this.ticketLink,
    };
  }
}

export const eventConverter = {
  toFirestore(event: Event): DocumentData {
    return {
      id: event.id,
      flareId: event.flare_id,
      title: event.title,
      description: event.description,
      type: event.type,
      ageGroup: event.ageGroup,
      date: event.date,
      location: event.location,
      price: event.price,
      ticketLink: event.ticketLink,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data = snapshot.data(options);
    return new Event(
      data.id,
      data.flareId,
      data.title,
      data.description,
      data.type,
      data.ageGroup,
      data.date,
      data.location,
      data.price,
      data.ticketLink
    );
  },
};
