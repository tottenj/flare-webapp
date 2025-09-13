import Event, { PlainEvent } from "@/lib/classes/event/Event";

export function ensureEvent(e: Event | PlainEvent): Event {
  return Event.isPlainEvent(e) ? Event.fromPlain(e) : e;
}
