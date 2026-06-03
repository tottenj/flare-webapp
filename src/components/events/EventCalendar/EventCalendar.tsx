'use client';

import { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import {
  EVENT_CATEGORY_META,
  type EventCategory as AppEventCategory,
} from '@/lib/types/EventCategory';
import { tagColorValue } from '@/lib/types/TagColour';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventContentArg } from '@fullcalendar/core/index.js';
import FullCalendar from '@fullcalendar/react';
import styles from './EventCalendar.module.css';

function getCategoryMeta(category: EventDto['category']) {
  if (category in EVENT_CATEGORY_META) {
    return EVENT_CATEGORY_META[category as AppEventCategory];
  }

  return null;
}

function toDateKey(dateIso: string, timezone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(new Date(dateIso));
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return dateIso.slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

export default function EventCalendar({ events }: { events: EventDto[] }) {
  const groupedByDayAndCategory = new Map<
    string,
    {
      date: string;
      category: EventDto['category'];
      count: number;
    }
  >();

  for (const event of events) {
    const date = toDateKey(event.startsAt, event.timezone);
    const key = `${date}|${event.category}`;
    const existing = groupedByDayAndCategory.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    groupedByDayAndCategory.set(key, {
      date,
      category: event.category,
      count: 1,
    });
  }

  const calendarEvents = Array.from(groupedByDayAndCategory.values()).map((entry) => {
    const categoryMeta = getCategoryMeta(entry.category);

    return {
      id: `${entry.date}-${entry.category}`,
      title: categoryMeta?.label ?? entry.category,
      date: entry.date,
      extendedProps: {
        dotText: String(entry.count),
        categoryLabel: categoryMeta?.label ?? entry.category,
        dotColor: categoryMeta ? tagColorValue(categoryMeta.color, 'accent') : '#6b7280',
      },
    };
  });

  function renderEventContent(eventContent: EventContentArg) {
    const dotText = String(eventContent.event.extendedProps.dotText ?? '');
    const dotColor = String(eventContent.event.extendedProps.dotColor ?? '#6b7280');
    const categoryLabel = String(eventContent.event.extendedProps.categoryLabel ?? '');

    return (
      <span
        className={styles.eventDot}
        style={{ backgroundColor: dotColor }}
        title={`${eventContent.event.title} (${categoryLabel})`}
      >
        {dotText}
      </span>
    );
  }

  return (
    <div className={styles.calendarShell}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        buttonText={{
          today: 'Today',
        }}
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={true}
        dayMaxEventRows={3}
        eventDisplay="block"
        events={calendarEvents}
        eventContent={renderEventContent}
      />
    </div>
  );
}
