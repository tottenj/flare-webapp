interface CalendarEvent {
  id: string;
  flare_id: string;
  title: string;
  description: string;
  type: string; // oklch(...) string
  ageGroup: string;
  date: string; // ISO string
  location: {
    id: string;
    name?: string | null;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  price: number | string;
  ticketLink?: string;
}
