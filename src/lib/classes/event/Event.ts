import AgeGroup from '@/lib/enums/AgeGroup';
import Collections from '@/lib/enums/collections';
import eventType, {
  getEventTypeKeyFromValue,
  getEventTypeValueFromKey,
} from '@/lib/enums/eventType';
import { distanceBetween, Geohash, geohashForLocation, geohashQueryBounds } from 'geofire-common';
import {
  addDocument,
  getCollectionByFields,
  getDocument,
  QueryOptions,
  WhereClause,
} from '@/lib/firebase/firestore/firestoreOperations';
import { addFile, getFile } from '@/lib/firebase/storage/storageOperations';
import EventFilters from '@/lib/types/FilterType';
import flareLocation from '@/lib/types/Location';

import {
  collection,
  DocumentData,
  endAt,
  Firestore,
  GeoPoint,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  startAt,
  Timestamp,
  where,
} from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default class Event {
  id: string;
  flare_id: string;
  title: string;
  description?: string;
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
    desciption: string | undefined,
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
      false,
      new Date(),
      '1'
    ),
    new Event(
      'flare005',
      'Open Mic Night',
      'Share your poetry, music, or comedy in a safe space.',
      eventType['Drag Events'],
      AgeGroup.AllAges,
      new Date('2025-07-10T18:30:00'),
      new Date('2025-07-10T18:30:00'),
      {
        id: 'loc005',
        name: 'The Cozy Corner',
        coordinates: new GeoPoint(41.8781, -87.6298), // Chicago
      },
      10,
      false,
      new Date(),
      '1'
    ),
  ];

  static async queryEvents(
    dab: Firestore,
    filters: EventFilters = {},
    options?: QueryOptions,
    unVerified: boolean = false
  ) {
    const { location, flare_id, ageGroup, type, onDate, afterDate, beforeDate } = filters;

    const passesFilters = (data: any, center?: { lat: number; lng: number }) => {
      if (center) {
        const lat = data.location?.coordinates?.latitude;
        const lng = data.location?.coordinates?.longitude;
        if (!lat || !lng) return false;
        const distanceInKm = distanceBetween([lat, lng], [center.lat, center.lng]);
        if (distanceInKm > location!.radius) return false;
      }

      if (!unVerified && !data.verified) return false;
      if (flare_id && data.flare_id !== flare_id) return false;
      if (ageGroup?.length && !ageGroup.includes(data.ageGroup)) return false;
      if (type?.length && !type.includes(data.type)) return false;

      const eventDateRaw = data.startdate;
      const eventDate = eventDateRaw?.toDate ? eventDateRaw.toDate() : eventDateRaw;

      if (onDate) {
        const startOfDay = new Date(onDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(onDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (eventDate < startOfDay || eventDate > endOfDay) return false;
      }
      if (afterDate && eventDate < afterDate) return false;
      if (beforeDate && eventDate > beforeDate) return false;

      return true;
    };

    if (location) {
      const { center, radius } = location;
      const bounds = geohashQueryBounds([center.lat, center.lng], radius * 1000);
      const promises = bounds.map((b) =>
        getDocs(
          query(
            collection(dab, 'Events'),
            where('verified', '==', true),
            orderBy('hash'),
            startAt(b[0]),
            endAt(b[1])
          )
        )
      );

      const snapshots = await Promise.all(promises);
      const filteredEvents: Event[] = [];

      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const data = doc.data();
          if (!passesFilters(data, center)) continue;
          filteredEvents.push(eventConverter.fromFirestore(doc, {} as SnapshotOptions));
        }
      }

      return filteredEvents;
    }

    const whereClauses: WhereClause[] = [];
    if (!unVerified) whereClauses.push(['verified', '==', true]);

    if (onDate) {
      const startOfDay = new Date(onDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(onDate);
      endOfDay.setHours(23, 59, 59, 999);
      whereClauses.push(['startDate', '>=', Timestamp.fromDate(startOfDay)]);
      whereClauses.push(['startDate', '<=', Timestamp.fromDate(endOfDay)]);
    }

    let realType: any[] = [];
    if (type?.length) {
      realType = type.map((t) => {
        return getEventTypeKeyFromValue(t);
      });
    }

    if (flare_id) whereClauses.push(['flareId', '==', flare_id]);
    if (ageGroup?.length) whereClauses.push(['ageGroup', 'in', ageGroup]);
    if (realType.length) whereClauses.push(['type', 'in', realType]);
    if (afterDate) whereClauses.push(['startDate', '>=', afterDate]);
    if (beforeDate) whereClauses.push(['startDate', '<=', beforeDate]);

    return getCollectionByFields(dab, Collections.Events, whereClauses, eventConverter, options);
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
      verified: this.verified,
      createdAt: this.createdAt,
      price: this.price,
      ticketLink: this.ticketLink,

      hash: this.hash,
    };
  }
}

export type PlainEvent = {
  id: string;
  flare_id: string;
  title: string;
  description?: string;
  type: string;
  ageGroup: string;
  startDate: Date;
  endDate: Date;
  location: {
    id: string;
    name?: string | null;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  verified: boolean;
  createdAt: Date;
  price?: number | string;
  ticketLink?: string;
  hash: string;
};

export const eventConverter = {
  toFirestore(event: Event): DocumentData {
    const evenType = getEventTypeKeyFromValue(event.type);

    return {
      id: event.id,
      flareId: event.flare_id,
      title: event.title,
      description: event.description,
      type: evenType,
      ageGroup: event.ageGroup,
      startDate: event.startdate,
      endDate: event.endDate,
      location: event.location,
      price: event.price,
      verified: event.verified,
      createdAt: event.createdAt,
      ticketLink: event.ticketLink,
      hash: event.hash,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data = snapshot.data(options);

    return new Event(
      data.flareId,
      data.title,
      data.description,
      eventType[data.type as keyof typeof eventType],
      data.ageGroup,
      data.startDate.toDate(),
      data.endDate.toDate(),
      data.location,
      data.price,
      data.verified,
      data.createdAt.toDate(),
      data.ticketLink,
      data.id
    );
  },
};
