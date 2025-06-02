import AgeGroup from '@/lib/enums/AgeGroup';
import Collections from '@/lib/enums/collections';
import eventType from '@/lib/enums/eventType';
import { addDocument, getCollectionByFields, getDocument, WhereClause } from '@/lib/firebase/firestore/firestoreOperations';
import { addFile, getFile } from '@/lib/firebase/storage/storageOperations';
import EventFilters from '@/lib/types/FilterType';
import flareLocation from '@/lib/types/Location';
import { QueryOptions } from '@testing-library/dom';
import {
  DocumentData,
  Firestore,
  GeoPoint,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default class Event {
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

  constructor(
    flare_id: string,
    title: string,
    desciption: string,
    type: eventType,
    ageGroup: AgeGroup,
    startDate: Date,
    endDate: Date,
    location: flareLocation,
    price: number | string,
    ticketLink?: string,
    id?: string
  ) {
    this.id = id ?? uuidv4();
    this.flare_id = flare_id;
    this.title = title;
    this.description = desciption;
    this.type = type;
    this.ageGroup = ageGroup;
    this.startdate = startDate;
    this.endDate = endDate;
    this.location = location;
    this.price = price;
    this.ticketLink = ticketLink;
  }

  async addEvent(dab: Firestore) {
    await addDocument(dab, `${Collections.Events}/${this.id}`, this, eventConverter);
  }

  async addEventImage(storage: FirebaseStorage, file: File) {
    await addFile(storage, this.imagePath, file);
  }

  async updateEvent(dab: Firestore, updates: Partial<Event>) {
    await addDocument(dab, `${Collections.Events}/${this.id}`, updates, eventConverter, {
      merge: true,
    });
  }

  static async uploadImages(id: string, storage: FirebaseStorage, files: File[]) {
    for (const file of files) {
      await addFile(storage, `Events/${id}`, file);
      console.log('File stored');
    }
  }

  async getImage(storage: FirebaseStorage) {
    return await getFile(storage, this.imagePath);
  }

  static async getEvent(dab: Firestore, eventId: string) {
    const even = await getDocument(dab, `${Collections.Events}/${eventId}`, eventConverter);
    if (!even.exists()) return null;
    return even.data();
  }

  get imagePath(): string {
    return `Events/${this.id}`;
  }

  static sampleEvents: Event[] = [
    new Event(
      'flare005',
      'Open Mic Night',
      'Share your poetry, music, or comedy in a safe space.',
      eventType['Other'],
      AgeGroup.AllAges,
      new Date('2025-07-10T18:30:00'),
      new Date('2025-07-10T18:30:00'),
      {
        id: 'loc005',
        name: 'The Cozy Corner',
        coordinates: new GeoPoint(41.8781, -87.6298), // Chicago
      },
      10,
      '1'
    ),
  ];

  static async queryEvents(dab: Firestore, filters: EventFilters = {}, options?: QueryOptions) {
    const whereClauses: WhereClause[] = [];
    if (filters.onDate) {
      const startOfDay = new Date(filters.onDate);
      
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.onDate);
      endOfDay.setHours(23, 59, 59, 999);
      whereClauses.push(['startDate', '>=', Timestamp.fromDate(startOfDay)]);
      whereClauses.push(['startDate', '<=', Timestamp.fromDate(endOfDay)]);
    }

    if (filters.flare_id) whereClauses.push(['flareId', '==', filters.flare_id]);
    if (filters.ageGroup && filters.ageGroup.length > 0) whereClauses.push(['ageGroup', 'in', filters.ageGroup]);
    if (filters.type && filters.type.length > 0) whereClauses.push(['type', 'in', filters.type]);
    if (filters.afterDate) whereClauses.push(['startDate', '<', filters.afterDate]);
    if (filters.beforeDate) whereClauses.push(['startDate', '>=', filters.beforeDate]);
    return await getCollectionByFields(
      dab,
      `${Collections.Events}`,
      whereClauses,
      eventConverter,
      options
    );
  }

  toPlain(): PlainEvent {
    return {
      id: this.id,
      flare_id: this.flare_id,
      title: this.title,
      description: this.description,
      type: this.type,
      ageGroup: this.ageGroup,
      startDate: this.startdate,
      endDate: this.endDate,
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

export type PlainEvent = {
  id: string;
  flare_id: string;
  title: string;
  description: string;
  type: string;
  ageGroup: string;
  startDate: Date
  endDate: Date
  location: {
    id: string;
    name?: string | null;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  price?: number | string;
  ticketLink?: string;
};






export const eventConverter = {
  toFirestore(event: Event): DocumentData {
    return {
      id: event.id,
      flareId: event.flare_id,
      title: event.title,
      description: event.description,
      type: event.type,
      ageGroup: event.ageGroup,
      startDate: event.startdate,
      endDate: event.endDate,
      location: event.location,
      price: event.price,
      ticketLink: event.ticketLink,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data = snapshot.data(options);
    return new Event(
      data.flareId,
      data.title,
      data.description,
      data.type,
      data.ageGroup,
      data.startDate.toDate(),
      data.endDate.toDate(),
      data.location,
      data.price,
      data.ticketLink,
      data.id
    );
  },
};
