import { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import {expect} from "@jest/globals"

export function expectOnlyEventIds(events: EventDto[], expectedIds: string[]) {
  const actualIds = events.map((event) => event.id).sort();
  expect(actualIds).toEqual([...expectedIds].sort());
}
